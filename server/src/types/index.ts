import { TicketStatus, TicketPriority } from '@prisma/client';

export type StatusType = TicketStatus;
export type PriorityType = TicketPriority;

export interface CreateTicketDTO {
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
  priority?: PriorityType;
  order_reference?: string;
}

export interface UpdateTicketDTO {
  status?: StatusType;
  priority?: PriorityType;
  notes?: string;
  author?: string;
}

export interface TicketQueryFilters {
  status?: StatusType;
  priority?: PriorityType;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'status' | 'priority' | 'ticket_id';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface DashboardStats {
  total: number;
  open: number;
  in_progress: number;
  closed: number;
  high_priority: number;
}
