import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, TicketQueryParams } from '@/lib/api';
import { CreateTicketInput, UpdateTicketInput } from '@/types/ticket';
import toast from 'react-hot-toast';

export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (params: TicketQueryParams) => [...ticketKeys.lists(), params] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
  stats: () => [...ticketKeys.all, 'stats'] as const,
};

export function useTickets(params: TicketQueryParams = {}) {
  return useQuery({
    queryKey: ticketKeys.list(params),
    queryFn: () => api.getTickets(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useTicket(ticketId: string) {
  return useQuery({
    queryKey: ticketKeys.detail(ticketId),
    queryFn: () => api.getTicketById(ticketId),
    enabled: !!ticketId,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ticketKeys.stats(),
    queryFn: () => api.getDashboardStats(),
    refetchInterval: 30000, // Background poll every 30 seconds
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketInput) => api.createTicket(input),
    onSuccess: (data) => {
      toast.success(`Ticket ${data.data.ticket_id} created successfully!`);
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create ticket. Please try again.');
    },
  });
}

export function useUpdateTicket(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTicketInput) => api.updateTicket(ticketId, input),
    onSuccess: (data) => {
      toast.success('Ticket updated successfully!');
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update ticket.');
    },
  });
}
