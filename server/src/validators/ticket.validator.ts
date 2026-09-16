import { z } from 'zod';
import { TicketStatus, TicketPriority } from '@prisma/client';

export const createTicketSchema = z.object({
  customer_name: z
    .string({ required_error: 'Customer name is required' })
    .trim()
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name cannot exceed 100 characters'),
  customer_email: z
    .string({ required_error: 'Customer email is required' })
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .toLowerCase(),
  subject: z
    .string({ required_error: 'Issue subject is required' })
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject cannot exceed 200 characters'),
  description: z
    .string({ required_error: 'Issue description is required' })
    .trim()
    .min(5, 'Description must be at least 5 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),
  priority: z
    .nativeEnum(TicketPriority, {
      errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, or HIGH' }),
    })
    .optional()
    .default(TicketPriority.MEDIUM),
  order_reference: z
    .string()
    .trim()
    .max(50, 'Order reference cannot exceed 50 characters')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
});

export const updateTicketSchema = z
  .object({
    status: z
      .nativeEnum(TicketStatus, {
        errorMap: () => ({ message: 'Status must be OPEN, IN_PROGRESS, or CLOSED' }),
      })
      .optional(),
    priority: z
      .nativeEnum(TicketPriority, {
        errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, or HIGH' }),
      })
      .optional(),
    notes: z
      .string()
      .trim()
      .max(2000, 'Note content cannot exceed 2000 characters')
      .optional()
      .nullable()
      .transform((val) => (val === '' ? null : val)),
    author: z
      .string()
      .trim()
      .max(100, 'Author name cannot exceed 100 characters')
      .optional()
      .default('Support Agent'),
  })
  .refine(
    (data) =>
      data.status !== undefined ||
      data.priority !== undefined ||
      (data.notes !== undefined && data.notes !== null),
    {
      message: 'At least one field (status, priority, or notes) must be provided to update',
    }
  );

export const ticketQuerySchema = z.object({
  status: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === 'ALL' || val === '') return undefined;
      // Convert standard casing (e.g. "Open" -> "OPEN", "In Progress" -> "IN_PROGRESS")
      const normalized = val.toUpperCase().replace(/\s+/g, '_');
      return normalized as TicketStatus;
    }),
  priority: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === 'ALL' || val === '') return undefined;
      return val.toUpperCase() as TicketPriority;
    }),
  search: z.string().trim().optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10) || 10)) : 10)),
  sortBy: z.enum(['created_at', 'status', 'priority', 'ticket_id']).optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const ticketIdParamSchema = z.object({
  ticket_id: z
    .string({ required_error: 'Ticket ID is required' })
    .trim()
    .min(1, 'Ticket ID cannot be empty'),
});
