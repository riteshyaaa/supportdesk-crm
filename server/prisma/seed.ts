import { PrismaClient, TicketStatus, TicketPriority } from '@prisma/client';

const prisma = new PrismaClient();

const sampleTickets = [
  {
    ticket_id: 'TKT-001',
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul.sharma@example.com',
    subject: 'Order not delivered within estimated date',
    description:
      'My package was expected to arrive yesterday by 4 PM, but the tracking page still shows in transit. I need this urgently for a scheduled company event.',
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    order_reference: 'ORD-2026-8901',
    notes: [
      {
        author: 'Support Lead',
        content: 'Flagged to logistics dispatch. Tracking ID #BLUEDART-882910.',
      },
    ],
    activities: [
      {
        action_type: 'TICKET_CREATED',
        description: 'Ticket created with status OPEN and priority HIGH',
      },
      {
        action_type: 'NOTE_ADDED',
        description: 'Internal note added by Support Lead',
      },
    ],
  },
  {
    ticket_id: 'TKT-002',
    customer_name: 'Priya Patel',
    customer_email: 'priya.patel@techcorp.in',
    subject: 'Request for invoice modification with GSTIN number',
    description:
      'We recently purchased the annual team plan. We need our corporate GSTIN (27AAAAA0000A1Z5) updated on the invoice for tax filing purposes.',
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.MEDIUM,
    order_reference: 'INV-2026-4421',
    notes: [
      {
        author: 'Billing Specialist',
        content: 'Validated GSTIN with government portal. Preparing revised tax invoice PDF.',
      },
    ],
    activities: [
      {
        action_type: 'TICKET_CREATED',
        description: 'Ticket created with status OPEN and priority MEDIUM',
      },
      {
        action_type: 'STATUS_UPDATED',
        description: 'Status changed from OPEN to IN_PROGRESS',
      },
      {
        action_type: 'NOTE_ADDED',
        description: 'Internal note added by Billing Specialist',
      },
    ],
  },
  {
    ticket_id: 'TKT-003',
    customer_name: 'Amit Verma',
    customer_email: 'amit.verma@startup.io',
    subject: 'Unable to invite new team members to workspace',
    description:
      'When clicking "Send Invite", an error modal pops up saying "Seats limit reached", but our dashboard shows 4/10 active seats.',
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    order_reference: 'SUB-2026-901',
    notes: [],
    activities: [
      {
        action_type: 'TICKET_CREATED',
        description: 'Ticket created with status OPEN and priority HIGH',
      },
    ],
  },
  {
    ticket_id: 'TKT-004',
    customer_name: 'Sneha Kulkarni',
    customer_email: 'sneha.k@gmail.com',
    subject: 'Refund processed but not reflected in bank account',
    description:
      'I was notified on Monday that my return of Order #ORD-2026-7731 was accepted and refund initiated. It has been 5 business days and the amount has not credited.',
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.MEDIUM,
    order_reference: 'ORD-2026-7731',
    notes: [
      {
        author: 'Finance Team',
        content: 'ARN number shared with payment gateway: 994820184719.',
      },
      {
        author: 'Support Agent',
        content: 'Emailed customer with ARN reference to check with their issuing bank.',
      },
    ],
    activities: [
      {
        action_type: 'TICKET_CREATED',
        description: 'Ticket created with status OPEN and priority MEDIUM',
      },
      {
        action_type: 'STATUS_UPDATED',
        description: 'Status changed from OPEN to IN_PROGRESS',
      },
      {
        action_type: 'NOTE_ADDED',
        description: 'Internal note added by Finance Team',
      },
      {
        action_type: 'NOTE_ADDED',
        description: 'Internal note added by Support Agent',
      },
    ],
  },
  {
    ticket_id: 'TKT-005',
    customer_name: 'David Miller',
    customer_email: 'david.m@globalenterprises.com',
    subject: 'API rate limits hitting 429 errors during batch sync',
    description:
      'Our nighttime ETL pipeline sync is encountering 429 Too Many Requests. Can we request a temporary rate limit increase for our API key during 02:00-04:00 UTC?',
    status: TicketStatus.CLOSED,
    priority: TicketPriority.LOW,
    order_reference: null,
    notes: [
      {
        author: 'DevOps Engineer',
        content: 'Adjusted Redis token bucket rate limit to 500 req/min for their dedicated API tier.',
      },
    ],
    activities: [
      {
        action_type: 'TICKET_CREATED',
        description: 'Ticket created with status OPEN and priority LOW',
      },
      {
        action_type: 'STATUS_UPDATED',
        description: 'Status changed from OPEN to IN_PROGRESS',
      },
      {
        action_type: 'NOTE_ADDED',
        description: 'Internal note added by DevOps Engineer',
      },
      {
        action_type: 'STATUS_UPDATED',
        description: 'Status changed from IN_PROGRESS to CLOSED',
      },
    ],
  },
  {
    ticket_id: 'TKT-006',
    customer_name: 'Ananya Roy',
    customer_email: 'ananya.roy@designstudio.co',
    subject: 'Damaged item received in parcel packaging',
    description:
      'The outer box arrived crushed and the acrylic stand inside has a noticeable crack along the base. I have attached photo evidence.',
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    order_reference: 'ORD-2026-6120',
    notes: [],
    activities: [
      {
        action_type: 'TICKET_CREATED',
        description: 'Ticket created with status OPEN and priority HIGH',
      },
    ],
  },
  {
    ticket_id: 'TKT-007',
    customer_name: 'Vikram Singh',
    customer_email: 'vikram.singh@logisticsone.net',
    subject: 'Clarification on custom webhook retry policy',
    description:
      'Does the webhook system implement exponential backoff if our receiver endpoint returns a 500 or 504 status code? If yes, what is the maximum retry duration?',
    status: TicketStatus.CLOSED,
    priority: TicketPriority.LOW,
    order_reference: null,
    notes: [
      {
        author: 'Support Agent',
        content: 'Shared developer docs link explaining exponential backoff (5 retries over 24 hours).',
      },
    ],
    activities: [
      {
        action_type: 'TICKET_CREATED',
        description: 'Ticket created with status OPEN and priority LOW',
      },
      {
        action_type: 'STATUS_UPDATED',
        description: 'Status changed from OPEN to CLOSED',
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing records safely
  await prisma.ticketActivity.deleteMany();
  await prisma.note.deleteMany();
  await prisma.ticket.deleteMany();

  console.log('🧹 Cleaned existing records.');

  for (const item of sampleTickets) {
    const { notes, activities, ...ticketData } = item;

    const ticket = await prisma.ticket.create({
      data: {
        ...ticketData,
        notes: {
          create: notes.map((n) => ({
            author: n.author,
            content: n.content,
          })),
        },
        activities: {
          create: activities.map((a) => ({
            action_type: a.action_type,
            description: a.description,
          })),
        },
      },
    });

    console.log(`✅ Seeded ticket: ${ticket.ticket_id} - ${ticket.subject}`);
  }

  console.log(`✨ Seeding completed successfully! Total tickets: ${sampleTickets.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
