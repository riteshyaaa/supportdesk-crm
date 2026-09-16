import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../services/ticket.service';
import { sendCreated, sendSuccess } from '../utils/response';
import { TicketQueryFilters } from '../types';

export class TicketController {
  private ticketService: TicketService;

  constructor(ticketService?: TicketService) {
    this.ticketService = ticketService || new TicketService();
  }

  /**
   * POST /api/tickets - Create a new support ticket
   */
  createTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ticket = await this.ticketService.createTicket(req.body);
      sendCreated(res, ticket);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/tickets - List tickets with search, filtering, and pagination
   */
  getTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as TicketQueryFilters;
      const { tickets, meta } = await this.ticketService.getTickets(filters);
      sendSuccess(res, tickets, 200, meta);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/tickets/stats/summary - Summary metrics for dashboard
   */
  getDashboardStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.ticketService.getDashboardStats();
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/tickets/:ticket_id - Retrieve single ticket details
   */
  getTicketById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ticket_id } = req.params;
      const ticket = await this.ticketService.getTicketById(ticket_id);
      sendSuccess(res, ticket);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/tickets/:ticket_id - Update ticket status/priority & add notes
   */
  updateTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ticket_id } = req.params;
      const updated = await this.ticketService.updateTicket(ticket_id, req.body);
      sendSuccess(res, updated);
    } catch (error) {
      next(error);
    }
  };
}
