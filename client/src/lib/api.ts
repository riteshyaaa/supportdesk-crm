import {
  ApiResponse,
  TicketListItem,
  TicketDetail,
  CreateTicketInput,
  UpdateTicketInput,
  DashboardStats,
  TicketStatus,
  TicketPriority,
} from '@/types/ticket';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface TicketQueryParams {
  status?: TicketStatus | 'ALL';
  priority?: TicketPriority | 'ALL';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'status' | 'priority' | 'ticket_id';
  sortOrder?: 'asc' | 'desc';
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await res.json();

    if (!res.ok || !data.success) {
      const errorMessage =
        data.error?.message ||
        (data.error?.details && data.error.details.length > 0
          ? data.error.details.map((d) => d.message).join(', ')
          : `HTTP error ${res.status}: ${res.statusText}`);
      throw new Error(errorMessage);
    }

    return data;
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server. Please verify the API is running.');
    }
    throw err;
  }
}

export const api = {
  // Fetch tickets with filters
  getTickets: async (params: TicketQueryParams = {}): Promise<ApiResponse<TicketListItem[]>> => {
    const query = new URLSearchParams();

    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.priority && params.priority !== 'ALL') query.append('priority', params.priority);
    if (params.search && params.search.trim() !== '') query.append('search', params.search.trim());
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<TicketListItem[]>(`/tickets${queryString}`);
  },

  // Fetch single ticket details
  getTicketById: async (ticketId: string): Promise<ApiResponse<TicketDetail>> => {
    return request<TicketDetail>(`/tickets/${encodeURIComponent(ticketId)}`);
  },

  // Create new ticket
  createTicket: async (input: CreateTicketInput): Promise<ApiResponse<TicketDetail>> => {
    return request<TicketDetail>('/tickets', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  // Update ticket status, priority, or add a note
  updateTicket: async (ticketId: string, input: UpdateTicketInput): Promise<ApiResponse<TicketDetail>> => {
    return request<TicketDetail>(`/tickets/${encodeURIComponent(ticketId)}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  // Fetch summary stats for dashboard cards
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return request<DashboardStats>('/tickets/stats/summary');
  },
};
