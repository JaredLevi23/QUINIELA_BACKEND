import { Prediction } from "./prediction.interface";

export interface Ticket {
  userId: string;
  tournamentId: string;
  nickName: string;
  folio: string;
  predictions: Prediction[];
  createdAt: string;
  updatedAt: string;
  ticketId: string;
}