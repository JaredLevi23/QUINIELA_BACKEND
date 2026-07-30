import { Match } from "./match.interface";

export interface MatchResponse {
  msg: string;
  matches: Match[];
}