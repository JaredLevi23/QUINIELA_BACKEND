import { Ticket } from "./ticket.interface";

export interface TicketCreateResponse {
  msg: string;
  ticket: Ticket;
}
