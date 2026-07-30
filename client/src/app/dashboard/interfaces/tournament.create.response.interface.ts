import { Tournament } from "./tournament.interface";

export interface TournamentCreateResponse {
  msg: string;
  tournament: Tournament;
}
