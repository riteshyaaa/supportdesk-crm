'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTicket, useUpdateTicket } from '@/hooks/useTickets';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ActivityTimeline } from '@/components/tickets/ActivityTimeline';
import { formatDate } from '@/lib/utils';
import { TicketStatus, TicketPriority } from '@/types/ticket';
import {
  ArrowLeft,
  Clock,
  User,
  Mail,
  ShoppingBag,
  MessageSquare,
  Send,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const { data: ticketData, isLoading, isError, error, refetch } = useTicket(ticketId);
  const updateMutation = useUpdateTicket(ticketId);

  // Form states for adding notes
  const [noteContent, setNoteContent] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Ritesh');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const ticket = ticketData?.data;

  // Copy to clipboard helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Status update handler
  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!ticket || ticket.status === newStatus) return;
    updateMutation.mutate({ status: newStatus });
  };

  // Priority update handler
  const handlePriorityChange = (newPriority: TicketPriority) => {
    if (!ticket || ticket.priority === newPriority) return;
    updateMutation.mutate({ priority: newPriority });
  };

  // Note submission handler
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) {
      toast.error('Please enter note content');
      return;
    }

    updateMutation.mutate(
      {
        notes: noteContent.trim(),
        author: noteAuthor.trim() || 'Support Agent',
      },
      {
        onSuccess: () => {
          setNoteContent('');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-slate-200 animate-pulse rounded" />
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="h-8 w-1/3 bg-slate-200 animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-slate-200 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-white rounded-xl border border-slate-200 animate-pulse" />
            <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-white rounded-xl border border-slate-200 animate-pulse" />
            <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="bg-white rounded-xl border border-rose-200 p-8 text-center shadow-sm max-w-lg mx-auto mt-12">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Ticket Not Found</h3>
        <p className="text-xs text-slate-500 mb-4">
          {(error as any)?.message || `We could not find any ticket with ID "${ticketId}".`}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try Again
          </Button>
          <Link href="/">
            <Button size="sm">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation & Ticket ID Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Ticket Dashboard
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Created {formatDate(ticket.created_at)}</span>
          <span>&bull;</span>
          <span>Updated {formatDate(ticket.updated_at)}</span>
        </div>
      </div>

      {/* Main Ticket Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-[280px]">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-base sm:text-lg font-bold text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-lg">
                {ticket.ticket_id}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              {ticket.order_reference && (
                <span className="inline-flex items-center gap-1 font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                  <ShoppingBag className="w-3 h-3 text-slate-400" />
                  {ticket.order_reference}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {ticket.subject}
            </h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || updateMutation.isPending}
            className="text-xs text-slate-600"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${updateMutation.isPending ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Details & Notes) - 2 cols on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Issue Description Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3.5">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                Customer & Issue Description
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Customer Meta Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Customer Name</span>
                  <span className="font-semibold text-slate-900">{ticket.customer_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Customer Email</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-800 truncate">{ticket.customer_email}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(ticket.customer_email, 'email')}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      title="Copy email"
                    >
                      {copiedField === 'email' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">Description</span>
                <div className="text-xs sm:text-sm text-slate-800 bg-white p-4 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed">
                  {ticket.description}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes & Comments Section */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3.5 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                Internal Agent Notes ({ticket.notes?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700">Add New Note</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Author:</span>
                    <input
                      type="text"
                      value={noteAuthor}
                      onChange={(e) => setNoteAuthor(e.target.value)}
                      placeholder="Agent name"
                      className="text-xs px-2 py-1 border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 w-32"
                    />
                  </div>
                </div>

                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Type an internal note or update for other team members..."
                  rows={3}
                  className="bg-white"
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={updateMutation.isPending}
                    disabled={!noteContent.trim()}
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Post Note
                  </Button>
                </div>
              </form>

              {/* Notes List */}
              {ticket.notes && ticket.notes.length > 0 ? (
                <div className="space-y-3">
                  {ticket.notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900">{note.author}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                            Agent
                          </span>
                        </div>
                        <span className="text-slate-400 text-[11px]">{formatDate(note.created_at)}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <MessageSquare className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                  No internal notes added yet. Use the form above to add one.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Controls & Activity Timeline) - 1 col on desktop */}
        <div className="space-y-6">
          {/* Quick Status and Priority Controls */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">Manage Ticket</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Status Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Update Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      value: 'OPEN' as TicketStatus,
                      label: 'Open',
                      active: 'bg-amber-50 border-amber-400 text-amber-900 font-semibold ring-1 ring-amber-400',
                      inactive: 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
                    },
                    {
                      value: 'IN_PROGRESS' as TicketStatus,
                      label: 'In Progress',
                      active: 'bg-blue-50 border-blue-400 text-blue-900 font-semibold ring-1 ring-blue-400',
                      inactive: 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
                    },
                    {
                      value: 'CLOSED' as TicketStatus,
                      label: 'Closed',
                      active: 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold ring-1 ring-emerald-400',
                      inactive: 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
                    },
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      disabled={updateMutation.isPending}
                      onClick={() => handleStatusChange(s.value)}
                      className={`py-2 px-2 rounded-lg border text-xs text-center transition-all ${
                        ticket.status === s.value ? s.active : s.inactive
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Update Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      value: 'LOW' as TicketPriority,
                      label: 'Low',
                      active: 'bg-slate-100 border-slate-400 text-slate-900 font-semibold ring-1 ring-slate-400',
                      inactive: 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
                    },
                    {
                      value: 'MEDIUM' as TicketPriority,
                      label: 'Medium',
                      active: 'bg-blue-50 border-blue-400 text-blue-900 font-semibold ring-1 ring-blue-400',
                      inactive: 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
                    },
                    {
                      value: 'HIGH' as TicketPriority,
                      label: 'High',
                      active: 'bg-rose-50 border-rose-400 text-rose-900 font-semibold ring-1 ring-rose-400',
                      inactive: 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
                    },
                  ].map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      disabled={updateMutation.isPending}
                      onClick={() => handlePriorityChange(p.value)}
                      className={`py-2 px-2 rounded-lg border text-xs text-center transition-all ${
                        ticket.priority === p.value ? p.active : p.inactive
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Activity Timeline Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Audit Activity History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ActivityTimeline activities={ticket.activities || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
