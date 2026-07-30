import { Team } from "./team.interface";
import { Tournament } from "./tournament.interface";

export interface Match {
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  matchDate: string;
  tournamentId: Tournament;
  createdAt: string;
  updatedAt: string;
  matchId: string;
}