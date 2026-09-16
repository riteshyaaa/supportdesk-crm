'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTickets, useDashboardStats } from '@/hooks/useTickets';
import { StatsCards } from '@/components/tickets/StatsCards';
import { FilterBar } from '@/components/tickets/FilterBar';
import { TicketTable } from '@/components/tickets/TicketTable';
import { TicketStatus, TicketPriority } from '@/types/ticket';
import { Button } from '@/components/ui/Button';
import { PlusCircle, RefreshCw, Layers } from 'lucide-react';

export default function DashboardPage() {
  // Filter & Search states
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<TicketStatus | 'ALL'>('ALL');
  const [priority, setPriority] = useState<TicketPriority | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'created_at' | 'status' | 'priority' | 'ticket_id'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to page 1 on search change
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Query tickets
  const {
    data: ticketsData,
    isLoading: isTicketsLoading,
    isError: isTicketsError,
    error: ticketsError,
    refetch: refetchTickets,
    isFetching: isTicketsFetching,
  } = useTickets({
    search: debouncedSearch,
    status,
    priority,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  // Query dashboard summary stats
  const {
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useDashboardStats();

  // Reset all filters
  const handleResetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setStatus('ALL');
    setPriority('ALL');
    setSortBy('created_at');
    setSortOrder('desc');
    setPage(1);
  };

  // Refresh data
  const handleRefreshAll = () => {
    refetchTickets();
    refetchStats();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Support Tickets</h1>
            {isTicketsFetching && !isTicketsLoading && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor, prioritize, and manage customer support requests in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isTicketsFetching}
            className="text-slate-600 hover:text-slate-900"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isTicketsFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Link href="/tickets/new">
            <Button size="sm" className="shadow-sm">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Create Ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Summary Cards */}
      <StatsCards
        stats={statsData?.data}
        isLoading={isStatsLoading}
        activeStatus={status}
        activePriority={priority}
        onSelectStatus={(newStatus) => {
          setStatus(newStatus);
          setPage(1);
        }}
        onSelectPriority={(newPriority) => {
          setPriority(newPriority);
          setPage(1);
        }}
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchTerm={searchInput}
        onSearchChange={setSearchInput}
        status={status}
        onStatusChange={(newStatus) => {
          setStatus(newStatus);
          setPage(1);
        }}
        priority={priority}
        onPriorityChange={(newPriority) => {
          setPriority(newPriority);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={(val) => {
          setSortBy(val);
          setPage(1);
        }}
        sortOrder={sortOrder}
        onSortOrderChange={(val) => {
          setSortOrder(val);
          setPage(1);
        }}
        totalResults={ticketsData?.meta?.total}
      />

      {/* Main Ticket Table & Pagination */}
      <TicketTable
        tickets={ticketsData?.data || []}
        isLoading={isTicketsLoading}
        isError={isTicketsError}
        errorMessage={(ticketsError as any)?.message}
        onRetry={refetchTickets}
        meta={ticketsData?.meta}
        onPageChange={(newPage) => setPage(newPage)}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
