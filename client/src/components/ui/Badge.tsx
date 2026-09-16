import React from 'react';
import { TicketStatus, TicketPriority } from '@/types/ticket';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Clock, Flame, ShieldAlert, Shield } from 'lucide-react';

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = {
    OPEN: {
      label: 'Open',
      icon: Clock,
      style: 'bg-amber-50 text-amber-700 border-amber-200/80 ring-1 ring-amber-400/20',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      icon: AlertCircle,
      style: 'bg-blue-50 text-blue-700 border-blue-200/80 ring-1 ring-blue-400/20',
    },
    CLOSED: {
      label: 'Closed',
      icon: CheckCircle2,
      style: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-1 ring-emerald-400/20',
    },
  }[status] || {
    label: status,
    icon: Clock,
    style: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        config.style,
        className
      )}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
  showIcon?: boolean;
}

export function PriorityBadge({ priority, className, showIcon = true }: PriorityBadgeProps) {
  const config = {
    HIGH: {
      label: 'High',
      icon: Flame,
      style: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-400/20',
    },
    MEDIUM: {
      label: 'Medium',
      icon: ShieldAlert,
      style: 'bg-orange-50 text-orange-700 border-orange-200 ring-1 ring-orange-400/20',
    },
    LOW: {
      label: 'Low',
      icon: Shield,
      style: 'bg-slate-50 text-slate-600 border-slate-200 ring-1 ring-slate-400/10',
    },
  }[priority] || {
    label: priority,
    icon: Shield,
    style: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border',
        config.style,
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </span>
  );
}
