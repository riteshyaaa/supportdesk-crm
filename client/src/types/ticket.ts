export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Note {
  id: string;
  ticket_id: string;
  author: string;
  content: string;
  created_at: string;
}

export interface TicketActivity {
  id: string;
  ticket_id: string;
  action_type: string;
  description: string;
  created_at: string;
}

export interface TicketListItem {
  id: string;
  ticket_id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  order_reference?: string | null;
  created_at: string;
  updated_at: string;
  _count?: {
    notes: number;
  };
}

export interface TicketDetail {
  id: string;
  ticket_id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  order_reference?: string | null;
  created_at: string;
  updated_at: string;
  notes: Note[];
  activities: TicketActivity[];
}

export interface CreateTicketInput {
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  order_reference?: string | null;
}

export interface UpdateTicketInput {
  status?: TicketStatus;
  priority?: TicketPriority;
  notes?: string | null;
  author?: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  error?: {
    message: string;
    code?: string;
    details?: Array<{ field: string; message: string }>;
  };
}
