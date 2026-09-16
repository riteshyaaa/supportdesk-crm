import { z } from 'zod';

export const createTicketFormSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name cannot exceed 100 characters'),
  customer_email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject cannot exceed 200 characters'),
  description: z
    .string()
    .trim()
    .min(5, 'Please provide a detailed description (at least 5 characters)')
    .max(5000, 'Description cannot exceed 5000 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    required_error: 'Please select a priority level',
  }),
  order_reference: z
    .string()
    .trim()
    .max(50, 'Order reference cannot exceed 50 characters')
    .optional()
    .or(z.literal('')),
});

export type CreateTicketFormValues = z.infer<typeof createTicketFormSchema>;

export const addNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, 'Note cannot be empty')
    .max(2000, 'Note cannot exceed 2000 characters'),
  author: z.string().trim().default('Support Agent'),
});

export type AddNoteFormValues = z.infer<typeof addNoteSchema>;
