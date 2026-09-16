'use client';

import React from 'react';
import { TicketStatus, TicketPriority } from '@/types/ticket';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  status: TicketStatus | 'ALL';
  onStatusChange: (status: TicketStatus | 'ALL') => void;
  priority: TicketPriority | 'ALL';
  onPriorityChange: (priority: TicketPriority | 'ALL') => void;
  sortBy: 'created_at' | 'status' | 'priority' | 'ticket_id';
  onSortByChange: (val: 'created_at' | 'status' | 'priority' | 'ticket_id') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (val: 'asc' | 'desc') => void;
  totalResults?: number;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  totalResults,
}: FilterBarProps) {
  const hasActiveFilters = status !== 'ALL' || priority !== 'ALL' || searchTerm.trim() !== '';

  const handleResetFilters = () => {
    onSearchChange('');
    onStatusChange('ALL');
    onPriorityChange('ALL');
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by customer, email, ticket ID, subject, or order..."
          className="w-full h-9.5 pl-9 pr-8 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Dropdown */}
        <div className="flex items-center gap-1.5">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as TicketStatus | 'ALL')}
            className="h-9.5 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm transition-colors cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Status: Open</option>
            <option value="IN_PROGRESS">Status: In Progress</option>
            <option value="CLOSED">Status: Closed</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="flex items-center gap-1.5">
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as TicketPriority | 'ALL')}
            className="h-9.5 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm transition-colors cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">Priority: High</option>
            <option value="MEDIUM">Priority: Medium</option>
            <option value="LOW">Priority: Low</option>
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as any)}
            className="h-9.5 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm transition-colors cursor-pointer"
          >
            <option value="created_at">Date Created</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
            <option value="ticket_id">Ticket ID</option>
          </select>

          <button
            type="button"
            onClick={() => onSortOrderChange(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="h-9.5 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm transition-colors flex items-center justify-center"
            title={`Sort ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="h-9.5 px-3 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
