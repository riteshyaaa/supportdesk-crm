import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { validateBody, validateQuery, validateParams } from '../middleware/validate';
import {
  createTicketSchema,
  updateTicketSchema,
  ticketQuerySchema,
  ticketIdParamSchema,
} from '../validators/ticket.validator';

const router = Router();
const controller = new TicketController();

// Create Ticket
router.post('/', validateBody(createTicketSchema), controller.createTicket);

// List / Search / Filter Tickets
router.get('/', validateQuery(ticketQuerySchema), controller.getTickets);

// Dashboard Summary Statistics
router.get('/stats/summary', controller.getDashboardStats);

// Get Single Ticket Details
router.get('/:ticket_id', validateParams(ticketIdParamSchema), controller.getTicketById);

// Update Ticket Status / Priority & Add Note
router.put(
  '/:ticket_id',
  validateParams(ticketIdParamSchema),
  validateBody(updateTicketSchema),
  controller.updateTicket
);

export default router;
