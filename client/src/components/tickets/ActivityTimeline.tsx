import React from 'react';
import { TicketActivity } from '@/types/ticket';
import { formatDate } from '@/lib/utils';
import { PlusCircle, RefreshCw, AlertTriangle, MessageSquare, History } from 'lucide-react';

interface ActivityTimelineProps {
  activities?: TicketActivity[];
}

export function ActivityTimeline({ activities = [] }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-slate-400 text-xs">
        <History className="w-5 h-5 mx-auto mb-1 text-slate-300" />
        No activity recorded yet.
      </div>
    );
  }

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'TICKET_CREATED':
        return <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />;
      case 'STATUS_UPDATED':
        return <RefreshCw className="w-3.5 h-3.5 text-blue-600" />;
      case 'PRIORITY_UPDATED':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case 'NOTE_ADDED':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <History className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, idx) => {
          const isLast = idx === activities.length - 1;
          return (
            <li key={activity.id}>
              <div className="relative pb-6">
                {!isLast && (
                  <span
                    className="absolute left-3.5 top-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 border border-slate-200 ring-4 ring-white">
                    {getActionIcon(activity.action_type)}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-xs font-medium text-slate-800">{activity.description}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatDate(activity.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
