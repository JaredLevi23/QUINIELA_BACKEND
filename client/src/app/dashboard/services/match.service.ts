import { Injectable, signal } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Match } from '../interfaces/match.interface';
import { map, Observable, of } from 'rxjs';
import { CreateMatchResponse } from '../interfaces/create.match.response.interface';
import { MatchResponse } from '../interfaces/match.response.interface';
import { UpdateMatchResponse } from '../interfaces/update.match.response.interface';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private readonly baseUrl: string = environments.baseUrl;
  private matchesCache: { [tournamentId: string]: Match[] } = {}; // <-- Caché por torneo

  matchList = signal<Match[]>([]);


  constructor(private http: HttpClient) {}

  createMatch(match: Match) : Observable<Match> {
  
    const headers = {
      'Content-Type': 'application/json',
      'x-token': localStorage.getItem('token') || ''
    }
  
    return this.http.post<CreateMatchResponse>(`${this.baseUrl}/api/matchs`, match, { headers }).pipe(
      map( response => {
        this.addToList(response.match);
        return response.match;
      })
    );
  }


  addToList(match: Match) {
    const current = this.matchList();
    this.matchList.set([...current, match]);
  }


  getMatchesByTournament(tournamentId: string) : Observable<Match[]> {
    if (this.matchesCache[tournamentId]) {
      this.matchList.set(this.matchesCache[tournamentId]);
      return of(this.matchesCache[tournamentId]);
    }
    const headers = {
      'Content-Type': 'application/json',
      'x-token': localStorage.getItem('token') || ''
    }
    return this.http.get<MatchResponse>(`${this.baseUrl}/api/matchs/tournament/${tournamentId}`, { headers })
    .pipe(map( response => {
      console.log('Matches recibidos del backend:', response.matches); 
      this.matchList.update(() => response.matches);
      this.matchesCache[tournamentId] = response.matches;
      return response.matches;
    } ));
  }

  updateMatch(matchId: string, match: Match) : Observable<Match> {
    const headers = {
      'Content-Type': 'application/json',
      'x-token': localStorage.getItem('token') || ''
    }

    // const body = {
    //   homeTeam: match.homeTeam.teamId,
    //   awayTeam: match.awayTeam.teamId,
    //   tournamentId: match.tournamentId.tournamentId,
    //   homeScore: match.homeScore,
    //   awayScore: match.awayScore,
    //   matchDate: match.matchDate
    // };

    // console.log( {body} );
    

    return this.http.put<UpdateMatchResponse>(`${this.baseUrl}/api/matchs/${matchId}`, match, { headers })
      .pipe(map(response => {
        const updatedMatch = response.match;
        const currentMatches = this.matchList();
        const index = currentMatches.findIndex(m => m.matchId === matchId);
        if (index !== -1) {
          // Tomar el valor de la lista y solo cambiar los scores, para evitar perder la referencia a los objetos de equipo y torneo
          (currentMatches[index] as any).homeScore = updatedMatch.homeScore;
          (currentMatches[index] as any).awayScore = updatedMatch.awayScore;
          this.matchList.set([...currentMatches]);
        }
        return updatedMatch;
      }));
  }


  deleteMatch(matchId: string): Observable<void> {
    const headers = {
      'Content-Type': 'application/json',
      'x-token': localStorage.getItem('token') || ''
    }

    return this.http.delete<void>(`${this.baseUrl}/api/matchs/${matchId}`, { headers }).pipe(
      map(() => {
        this.matchList.update(list => list.filter(m => m.matchId !== matchId));
      })
    );
  }

}
