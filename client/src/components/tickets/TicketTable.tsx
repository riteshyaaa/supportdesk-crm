'use client';

import React from 'react';
import Link from 'next/link';
import { TicketListItem, PaginationMeta } from '@/types/ticket';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import {
  MessageSquare,
  ChevronRight,
  Inbox,
  AlertCircle,
  ChevronLeft,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TicketTableProps {
  tickets: TicketListItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
}

export function TicketTable({
  tickets,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  meta,
  onPageChange,
  onResetFilters,
}: TicketTableProps) {
  // Error State
  if (isError) {
    return (
      <div className="bg-white rounded-xl border border-rose-200 p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Failed to load tickets</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
          {errorMessage || 'There was an issue communicating with the support database.'}
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="h-4 w-28 bg-slate-100 animate-pulse rounded" />
          <div className="h-4 w-20 bg-slate-100 animate-pulse rounded" />
        </div>
        <div className="divide-y divide-slate-100">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-6 w-16 bg-slate-100 animate-pulse rounded" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-3/4 bg-slate-100 animate-pulse rounded" />
                  <div className="h-3 w-1/3 bg-slate-100 animate-pulse rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-20 bg-slate-100 animate-pulse rounded-full" />
                <div className="h-5 w-16 bg-slate-100 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty State (Zero results found)
  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">No tickets match your filters</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
          Try changing your search terms, clearing status filters, or create a new support ticket.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            Reset All Filters
          </Button>
          <Link href="/tickets/new">
            <Button size="sm">Create New Ticket</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Desktop Table View (Hidden on Mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Subject & Reference</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Notes</th>
              <th className="py-3 px-4 text-right">Created</th>
              <th className="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                {/* Ticket ID */}
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  <Link
                    href={`/tickets/${ticket.ticket_id}`}
                    className="font-mono text-brand-700 hover:text-brand-900 hover:underline block"
                  >
                    {ticket.ticket_id}
                  </Link>
                </td>

                {/* Customer Info */}
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-900">{ticket.customer_name}</div>
                  <div className="text-slate-400 text-[11px] truncate max-w-[180px]">
                    {ticket.customer_email}
                  </div>
                </td>

                {/* Subject & Order Reference */}
                <td className="py-3.5 px-4 max-w-xs">
                  <Link
                    href={`/tickets/${ticket.ticket_id}`}
                    className="font-medium text-slate-900 hover:text-brand-700 line-clamp-1 block"
                  >
                    {ticket.subject}
                  </Link>
                  {ticket.order_reference && (
                    <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500">
                      <ShoppingBag className="w-3 h-3 text-slate-400" />
                      <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded text-[10px] text-slate-600">
                        {ticket.order_reference}
                      </span>
                    </div>
                  )}
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-4">
                  <StatusBadge status={ticket.status} />
                </td>

                {/* Priority Badge */}
                <td className="py-3.5 px-4">
                  <PriorityBadge priority={ticket.priority} />
                </td>

                {/* Notes Count */}
                <td className="py-3.5 px-4">
                  {ticket._count && ticket._count.notes > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                      <MessageSquare className="w-3 h-3 text-slate-400" />
                      {ticket._count.notes}
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                {/* Created Timestamp */}
                <td className="py-3.5 px-4 text-right text-slate-500 text-[11px] whitespace-nowrap">
                  {formatDate(ticket.created_at)}
                </td>

                {/* Action Arrow */}
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href={`/tickets/${ticket.ticket_id}`}
                    className="p-1 rounded text-slate-400 group-hover:text-slate-900 transition-colors inline-block"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (Visible only on mobile/tablet) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/tickets/${ticket.ticket_id}`}
            className="block p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold text-brand-700">{ticket.ticket_id}</span>
              <div className="flex items-center gap-1.5">
                <StatusBadge status={ticket.status} showIcon={false} />
                <PriorityBadge priority={ticket.priority} showIcon={false} />
              </div>
            </div>

            <h4 className="text-sm font-semibold text-slate-900 line-clamp-1 mb-1">{ticket.subject}</h4>

            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <div>
                <span className="font-medium text-slate-700">{ticket.customer_name}</span>
                {ticket.order_reference && (
                  <span className="ml-2 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                    {ticket.order_reference}
                  </span>
                )}
              </div>
              <span className="text-[11px]">{formatDate(ticket.created_at)}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Footer */}
      {meta && (
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing{' '}
            <span className="font-semibold text-slate-900">
              {meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-900">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{' '}
            of <span className="font-semibold text-slate-900">{meta.total}</span> tickets
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasPrevPage}
              onClick={() => onPageChange(meta.page - 1)}
              className="h-8 px-2.5 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Previous
            </Button>
            <span className="text-xs text-slate-500 font-medium px-1">
              Page {meta.page} of {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasNextPage}
              onClick={() => onPageChange(meta.page + 1)}
              className="h-8 px-2.5 text-xs"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
