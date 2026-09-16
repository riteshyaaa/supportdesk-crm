# SupportDesk CRM

A full-stack customer support ticketing system built with Next.js, Express, TypeScript, and PostgreSQL.

---

## Features

- **Ticket Creation**: Create support tickets with customer info, subject, description, priority, and optional order reference. Tickets receive auto-generated sequential IDs (`TKT-001`, `TKT-002`, etc.).
- **Ticket Dashboard**: View tickets in a responsive table with server-side pagination, debounced multi-field search, and status/priority filters.
- **KPI Summary Cards**: Overview of open, in-progress, closed, and high-priority tickets. Clicking a card automatically filters the list.
- **Ticket Management**: Update status (`OPEN`, `IN_PROGRESS`, `CLOSED`) and priority (`LOW`, `MEDIUM`, `HIGH`) from the detail page.
- **Internal Notes**: Support agents can post internal comments and discussions directly on tickets.
- **Audit Activity Log**: Automatic logging of ticket events (creation, status updates, priority updates, notes added) with timestamps.

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, TanStack React Query, React Hook Form, Zod, Lucide Icons
- **Backend**: Express.js, TypeScript, Prisma ORM, PostgreSQL, Zod validation
- **Database**: PostgreSQL(Neon)

---

## Project Structure

```text
support_agent/
├── client/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/                # App Router pages (dashboard, new ticket, ticket details)
│   │   ├── components/         # UI & Ticket components (tables, filters, cards)
│   │   ├── hooks/              # React Query hooks for API integration
│   │   ├── lib/                # API client wrapper and utility functions
│   │   └── types/              # TypeScript interfaces
│   └── package.json
│
├── server/                     # Express.js Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma models (Ticket, Note, TicketActivity)
│   │   └── seed.ts             # Initial sample seed data
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Zod validation & centralized error handler
│   │   ├── repositories/       # Database queries & Prisma transactions
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic & ticket ID generation
│   │   ├── app.ts              # Express app setup & CORS configuration
│   │   └── server.ts           # Server entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v18+`
- **PostgreSQL**: Running locally or via a cloud provider (e.g. Neon, Supabase)

---

### 1. Backend Setup

1. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://postgres:Db_Password@localhost:5432/supportdesk_db?schema=public"
   CORS_ORIGIN="http://localhost:3000,http://127.0.0.1:3000"
   ```

3. Push the Prisma schema to your database and seed initial data:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The API will be running at `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open a new terminal, navigate to the client folder, and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Create a `.env.local` file in the `client` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000] in your browser.

---

## API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check endpoint |
| `GET` | `/api/tickets` | Fetch tickets with search, filters, pagination, and sorting |
| `GET` | `/api/tickets/stats/summary` | Fetch ticket count statistics for dashboard cards |
| `GET` | `/api/tickets/:ticket_id` | Fetch single ticket by ID with notes and activity history |
| `POST` | `/api/tickets` | Create a new ticket |
| `PUT` | `/api/tickets/:ticket_id` | Update ticket status/priority or add an internal note |
