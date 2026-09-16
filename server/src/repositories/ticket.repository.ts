import { PrismaClient, Prisma, TicketStatus, TicketPriority } from '@prisma/client';
import { CreateTicketDTO, TicketQueryFilters, DashboardStats } from '../types';

export const prisma = new PrismaClient();

export class TicketRepository {
  /**
   * Find tickets with multi-field search, status/priority filtering, and pagination
   */
  async findManyWithFilters(filters: TicketQueryFilters) {
    const { status, priority, search, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.TicketWhereInput = {};

    // Filter by Status
    if (status) {
      where.status = status;
    }

    // Filter by Priority
    if (priority) {
      where.priority = priority;
    }

    // Case-insensitive multi-field search
    if (search && search.trim() !== '') {
      const query = search.trim();
      where.OR = [
        { ticket_id: { contains: query, mode: 'insensitive' } },
        { customer_name: { contains: query, mode: 'insensitive' } },
        { customer_email: { contains: query, mode: 'insensitive' } },
        { subject: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { order_reference: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          id: true,
          ticket_id: true,
          customer_name: true,
          customer_email: true,
          subject: true,
          status: true,
          priority: true,
          order_reference: true,
          created_at: true,
          updated_at: true,
          _count: {
            select: { notes: true },
          },
        },
      }),
      prisma.ticket.count({ where }),
    ]);

    return { items, total };
  }

  /**
   * Find a single ticket by its public ticket_id with notes and activity history
   */
  async findByTicketId(ticket_id: string) {
    return prisma.ticket.findUnique({
      where: { ticket_id },
      include: {
        notes: {
          orderBy: { created_at: 'desc' },
        },
        activities: {
          orderBy: { created_at: 'desc' },
        },
      },
    });
  }

  /**
   * Count total existing tickets to determine sequential ID
   */
  async countAll(): Promise<number> {
    return prisma.ticket.count();
  }

  /**
   * Find the highest ticket_id to calculate the next sequence number accurately
   */
  async findLatestTicket() {
    return prisma.ticket.findFirst({
      orderBy: { created_at: 'desc' },
      select: { ticket_id: true },
    });
  }

  /**
   * Create a new ticket and record the creation activity in a transaction
   */
  async create(data: CreateTicketDTO, ticket_id: string) {
    return prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.create({
        data: {
          ticket_id,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          subject: data.subject,
          description: data.description,
          priority: data.priority || TicketPriority.MEDIUM,
          order_reference: data.order_reference || null,
          status: TicketStatus.OPEN,
        },
      });

      // Record activity
      await tx.ticketActivity.create({
        data: {
          ticket_id: ticket.id,
          action_type: 'TICKET_CREATED',
          description: `Ticket created with status OPEN and priority ${ticket.priority}`,
        },
      });

      return ticket;
    });
  }

  /**
   * Update a ticket's status, priority, and/or append a note with activity logs
   */
  async update(
    ticket_id: string,
    updates: { status?: TicketStatus; priority?: TicketPriority },
    noteContent?: string | null,
    author: string = 'Support Agent'
  ) {
    return prisma.$transaction(async (tx) => {
      // Find current ticket
      const current = await tx.ticket.findUnique({
        where: { ticket_id },
      });

      if (!current) {
        return null;
      }

      const activitiesToCreate: Prisma.TicketActivityCreateManyInput[] = [];

      // Detect status change
      if (updates.status && updates.status !== current.status) {
        activitiesToCreate.push({
          ticket_id: current.id,
          action_type: 'STATUS_UPDATED',
          description: `Status changed from ${current.status} to ${updates.status}`,
        });
      }

      // Detect priority change
      if (updates.priority && updates.priority !== current.priority) {
        activitiesToCreate.push({
          ticket_id: current.id,
          action_type: 'PRIORITY_UPDATED',
          description: `Priority changed from ${current.priority} to ${updates.priority}`,
        });
      }

      // Add note if provided
      if (noteContent && noteContent.trim() !== '') {
        const note = await tx.note.create({
          data: {
            ticket_id: current.id,
            author,
            content: noteContent.trim(),
          },
        });

        activitiesToCreate.push({
          ticket_id: current.id,
          action_type: 'NOTE_ADDED',
          description: `Internal note added by ${author}`,
        });
      }

      // Perform ticket update
      const updatedTicket = await tx.ticket.update({
        where: { ticket_id },
        data: {
          ...(updates.status ? { status: updates.status } : {}),
          ...(updates.priority ? { priority: updates.priority } : {}),
        },
        include: {
          notes: {
            orderBy: { created_at: 'desc' },
          },
          activities: {
            orderBy: { created_at: 'desc' },
          },
        },
      });

      // Save activity logs if any
      if (activitiesToCreate.length > 0) {
        await tx.ticketActivity.createMany({
          data: activitiesToCreate,
        });
      }

      return updatedTicket;
    });
  }

  /**
   * Calculate aggregated dashboard metrics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const [total, open, in_progress, closed, high_priority] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: TicketStatus.OPEN } }),
      prisma.ticket.count({ where: { status: TicketStatus.IN_PROGRESS } }),
      prisma.ticket.count({ where: { status: TicketStatus.CLOSED } }),
      prisma.ticket.count({ where: { priority: TicketPriority.HIGH, status: { not: TicketStatus.CLOSED } } }),
    ]);

    return {
      total,
      open,
      in_progress,
      closed,
      high_priority,
    };
  }
}
