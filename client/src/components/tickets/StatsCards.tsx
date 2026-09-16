'use client';

import React from 'react';
import { DashboardStats, TicketStatus, TicketPriority } from '@/types/ticket';
import { Inbox, Clock, AlertCircle, CheckCircle2, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  stats?: DashboardStats;
  isLoading: boolean;
  activeStatus?: TicketStatus | 'ALL';
  activePriority?: TicketPriority | 'ALL';
  onSelectStatus: (status: TicketStatus | 'ALL') => void;
  onSelectPriority: (priority: TicketPriority | 'ALL') => void;
}

export function StatsCards({
  stats,
  isLoading,
  activeStatus,
  activePriority,
  onSelectStatus,
  onSelectPriority,
}: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Tickets',
      value: stats?.total ?? 0,
      icon: Inbox,
      color: 'text-slate-700',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      isActive: activeStatus === 'ALL' && activePriority === 'ALL',
      onClick: () => {
        onSelectStatus('ALL');
        onSelectPriority('ALL');
      },
    },
    {
      title: 'Open Issues',
      value: stats?.open ?? 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50/70',
      borderColor: 'border-amber-200/80',
      isActive: activeStatus === 'OPEN',
      onClick: () => {
        onSelectStatus(activeStatus === 'OPEN' ? 'ALL' : 'OPEN');
        onSelectPriority('ALL');
      },
    },
    {
      title: 'In Progress',
      value: stats?.in_progress ?? 0,
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50/70',
      borderColor: 'border-blue-200/80',
      isActive: activeStatus === 'IN_PROGRESS',
      onClick: () => {
        onSelectStatus(activeStatus === 'IN_PROGRESS' ? 'ALL' : 'IN_PROGRESS');
        onSelectPriority('ALL');
      },
    },
    {
      title: 'Closed / Resolved',
      value: stats?.closed ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50/70',
      borderColor: 'border-emerald-200/80',
      isActive: activeStatus === 'CLOSED',
      onClick: () => {
        onSelectStatus(activeStatus === 'CLOSED' ? 'ALL' : 'CLOSED');
        onSelectPriority('ALL');
      },
    },
    {
      title: 'High Priority',
      value: stats?.high_priority ?? 0,
      icon: Flame,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50/70',
      borderColor: 'border-rose-200/80',
      isActive: activePriority === 'HIGH',
      onClick: () => {
        onSelectPriority(activePriority === 'HIGH' ? 'ALL' : 'HIGH');
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <button
            key={idx}
            type="button"
            onClick={card.onClick}
            className={cn(
              'flex flex-col p-4 rounded-xl border text-left transition-all duration-150 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-slate-900',
              card.isActive
                ? 'bg-white border-slate-900 shadow-sm ring-1 ring-slate-900'
                : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
            )}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-medium text-slate-500 tracking-tight">{card.title}</span>
              <div className={cn('p-1.5 rounded-lg border', card.bgColor, card.borderColor)}>
                <Icon className={cn('w-4 h-4', card.color)} />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              {isLoading ? (
                <div className="h-7 w-12 bg-slate-100 animate-pulse rounded" />
              ) : (
                <span className="text-2xl font-bold tracking-tight text-slate-900">{card.value}</span>
              )}
            </div>

            {card.isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
            )}
          </button>
        );
      })}
    </div>
  );
}
