import { Tournament } from "./tournament.interface";


export interface TournamentListResponse {
    msg: string;
    tournaments: Tournament[];
}