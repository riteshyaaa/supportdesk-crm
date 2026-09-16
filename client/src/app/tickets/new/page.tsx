'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTicket } from '@/hooks/useTickets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Send, ShieldAlert, Sparkles, User, Mail, FileText, ShoppingBag } from 'lucide-react';

const createTicketSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name must not exceed 100 characters'),
  customer_email: z
    .string()
    .email('Please enter a valid email address')
    .max(150, 'Email must not exceed 150 characters'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must not exceed 200 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    required_error: 'Please select a priority level',
  }),
  order_reference: z
    .string()
    .max(50, 'Order reference must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
});

type CreateTicketFormData = z.infer<typeof createTicketSchema>;

export default function NewTicketPage() {
  const router = useRouter();
  const createTicketMutation = useCreateTicket();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      customer_name: '',
      customer_email: '',
      subject: '',
      description: '',
      priority: 'MEDIUM',
      order_reference: '',
    },
  });

  const selectedPriority = watch('priority');

  const onSubmit = async (data: CreateTicketFormData) => {
    const payload = {
      ...data,
      order_reference: data.order_reference?.trim() ? data.order_reference.trim() : undefined,
    };

    createTicketMutation.mutate(payload, {
      onSuccess: (res) => {
        router.push(`/tickets/${res.data.ticket_id}`);
      },
    });
  };

  // Pre-fill demo data helper for fast testing/evaluation
  const fillSampleData = () => {
    setValue('customer_name', 'Sarah Jenkins');
    setValue('customer_email', 'sarah.jenkins@example.com');
    setValue('subject', 'Delayed shipment for order replacement');
    setValue(
      'description',
      'The customer reached out via live chat stating their replacement parts have been in transit for 7 days without courier tracking updates. They request expedited dispatch or express re-routing.'
    );
    setValue('priority', 'HIGH');
    setValue('order_reference', 'ORD-2026-8842');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Ticket Dashboard
        </Link>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fillSampleData}
          className="text-xs text-brand-700 hover:text-brand-800 border-brand-200 hover:bg-brand-50"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-600" />
          Fill Demo Sample
        </Button>
      </div>

      {/* Main Form Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-xl font-bold text-slate-900">Create Support Ticket</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Log an incoming customer inquiry. A deterministic unique Ticket ID (`TKT-XXX`) will be auto-generated.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Customer Information (Two columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Customer Full Name *"
                  placeholder="e.g. John Doe"
                  {...register('customer_name')}
                  error={errors.customer_name?.message}
                />
              </div>

              <div>
                <Input
                  label="Customer Email Address *"
                  type="email"
                  placeholder="e.g. john.doe@company.com"
                  {...register('customer_email')}
                  error={errors.customer_email?.message}
                />
              </div>
            </div>

            {/* Subject and Order Reference */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Ticket Subject *"
                  placeholder="e.g. Billing inquiry regarding invoice #1029"
                  {...register('subject')}
                  error={errors.subject?.message}
                />
              </div>

              <div>
                <Input
                  label="Order Reference"
                  placeholder="e.g. ORD-2026-001"
                  {...register('order_reference')}
                  error={errors.order_reference?.message}
                  helperText="Optional e-commerce order ID"
                />
              </div>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Priority Level *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    value: 'LOW',
                    label: 'Low',
                    desc: 'General inquiry or minor feedback',
                    border: 'hover:border-slate-400',
                    active: 'border-slate-800 bg-slate-50 ring-1 ring-slate-800',
                  },
                  {
                    value: 'MEDIUM',
                    label: 'Medium',
                    desc: 'Standard issue or service request',
                    border: 'hover:border-blue-400',
                    active: 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600',
                  },
                  {
                    value: 'HIGH',
                    label: 'High',
                    desc: 'Critical blocker or urgent escalation',
                    border: 'hover:border-rose-400',
                    active: 'border-rose-600 bg-rose-50/50 ring-1 ring-rose-600',
                  },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setValue('priority', item.value as any, { shouldValidate: true })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedPriority === item.value
                        ? item.active
                        : 'border-slate-200 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{item.label}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.value === 'HIGH'
                            ? 'bg-rose-500'
                            : item.value === 'MEDIUM'
                            ? 'bg-blue-500'
                            : 'bg-slate-400'
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                  </button>
                ))}
              </div>
              {errors.priority && (
                <p className="text-[11px] text-rose-600 mt-1.5">{errors.priority.message}</p>
              )}
            </div>

            {/* Description Textarea */}
            <div>
              <Textarea
                label="Detailed Description *"
                rows={5}
                placeholder="Provide comprehensive details of the customer issue, symptoms, steps taken, or specific requests..."
                {...register('description')}
                error={errors.description?.message}
                helperText="Minimum 10 characters. Markdown or plain text supported."
              />
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link href="/">
                <Button type="button" variant="outline" size="md">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                size="md"
                isLoading={createTicketMutation.isPending || isSubmitting}
              >
                <Send className="w-4 h-4 mr-1.5" />
                Submit Ticket
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
