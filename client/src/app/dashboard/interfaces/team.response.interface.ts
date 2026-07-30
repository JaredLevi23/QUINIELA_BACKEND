import { Team } from "./team.interface";

export interface TeamResponse {
  msg: string;
  teams: Team[];
}