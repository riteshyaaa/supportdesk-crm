import { TicketRepository } from '../repositories/ticket.repository';
import { CreateTicketDTO, UpdateTicketDTO, TicketQueryFilters, PaginationMeta } from '../types';
import { AppError } from '../utils/appError';

export class TicketService {
  private ticketRepo: TicketRepository;

  constructor(ticketRepo?: TicketRepository) {
    this.ticketRepo = ticketRepo || new TicketRepository();
  }

  /**
   * Generates a clean sequential ticket ID (e.g. "TKT-001", "TKT-002")
   */
  private async generateNextTicketId(): Promise<string> {
    const totalCount = await this.ticketRepo.countAll();
    const latestTicket = await this.ticketRepo.findLatestTicket();

    let nextNumber = totalCount + 1;

    // If there is an existing ticket, parse its number to prevent collisions after deletions
    if (latestTicket?.ticket_id) {
      const match = latestTicket.ticket_id.match(/TKT-(\d+)/i);
      if (match && match[1]) {
        const parsed = parseInt(match[1], 10);
        if (!isNaN(parsed)) {
          nextNumber = Math.max(nextNumber, parsed + 1);
        }
      }
    }

    const paddedNumber = String(nextNumber).padStart(3, '0');
    return `TKT-${paddedNumber}`;
  }

  /**
   * Create a new ticket
   */
  async createTicket(dto: CreateTicketDTO) {
    // Generate unique sequential ticket ID
    let ticketId = await this.generateNextTicketId();

    // Verify uniqueness just in case
    let attempts = 0;
    while (attempts < 5) {
      const existing = await this.ticketRepo.findByTicketId(ticketId);
      if (!existing) break;
      attempts++;
      const num = parseInt(ticketId.replace('TKT-', ''), 10) + 1;
      ticketId = `TKT-${String(num).padStart(3, '0')}`;
    }

    const ticket = await this.ticketRepo.create(dto, ticketId);
    return ticket;
  }

  /**
   * List tickets with search, filtering, and pagination
   */
  async getTickets(filters: TicketQueryFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const { items, total } = await this.ticketRepo.findManyWithFilters(filters);

    const totalPages = Math.ceil(total / limit) || 1;
    const meta: PaginationMeta = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return { tickets: items, meta };
  }

  /**
   * Retrieve a single ticket by its ticket_id
   */
  async getTicketById(ticketId: string) {
    const ticket = await this.ticketRepo.findByTicketId(ticketId);
    if (!ticket) {
      throw AppError.notFound(`Ticket with ID '${ticketId}' was not found`);
    }
    return ticket;
  }

  /**
   * Update ticket status, priority, or add internal notes
   */
  async updateTicket(ticketId: string, dto: UpdateTicketDTO) {
    const existing = await this.ticketRepo.findByTicketId(ticketId);
    if (!existing) {
      throw AppError.notFound(`Ticket with ID '${ticketId}' was not found`);
    }

    const updated = await this.ticketRepo.update(
      ticketId,
      {
        status: dto.status,
        priority: dto.priority,
      },
      dto.notes,
      dto.author || 'Support Agent'
    );

    if (!updated) {
      throw AppError.notFound(`Failed to update ticket '${ticketId}'`);
    }

    return updated;
  }

  /**
   * Get calculated dashboard statistics
   */
  async getDashboardStats() {
    return this.ticketRepo.getDashboardStats();
  }
}
