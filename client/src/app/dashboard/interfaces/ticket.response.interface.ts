import { Ticket } from "./ticket.interface";

export interface TicketResponse {
  msg: string;
  tickets: Ticket[];
}
