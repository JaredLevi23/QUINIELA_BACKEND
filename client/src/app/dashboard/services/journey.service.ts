import { Injectable, signal } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Tournament } from '../interfaces/tournament.interface';
import { TournamentListResponse } from '../interfaces/tournament.list.response.interface';
import { TournamentCreateResponse } from '../interfaces/tournament.create.response.interface';
import { BehaviorSubject, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JourneyService {

  private readonly baseUrl: string = environments.baseUrl;
  tournaments = signal<Tournament[]>([]);

  constructor(private http: HttpClient) {
    this.loadJourneys().subscribe({
      next: tournaments => {
        this.setTournaments(tournaments);
        console.log('Torneos cargados al iniciar JourneyService:', this.tournaments());
      },
      error: err => {
        console.error('Error al cargar los torneos al iniciar JourneyService:', err);
      }
    });
  }

  // Método para agregar un torneo localmente
  addTournamentLocally(tournament: Tournament): void {
    const current = this.tournaments();
    this.tournaments.set([...current, tournament]);
  }

  // Método para setear la lista completa (por ejemplo, tras cargar desde backend)
  setTournaments(tournaments: Tournament[]) {
    this.tournaments.set(tournaments);
  }

  createJourney(journey: Tournament) : Observable<Tournament> {
    const headers = {
      'Content-Type': 'application/json',
      'x-token': localStorage.getItem('token') || ''
    }
    return this.http.post<TournamentCreateResponse>(`${this.baseUrl}/api/tournaments`, journey, { headers }).pipe(
      map( response => {
        this.addTournamentLocally(response.tournament);
        return response.tournament;
      }
    ));
  }

  uploadTournamentFile(file: File, name: string, startDate: string, endDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);

    const headers = {
      'x-token': localStorage.getItem('token') || ''
    };

    return this.http.post<any>(`${this.baseUrl}/api/tickets/upload`, formData, { headers });
  }

  loadJourneys() : Observable<Tournament[]> {

    console.log( 'Cargando torneos' );

    const headers = {
      'Content-Type': 'application/json',
      'x-token': localStorage.getItem('token') || ''
    }
    return this.http.get<TournamentListResponse>(`${this.baseUrl}/api/tournaments`, { headers }).pipe(
      map( response => {
        this.setTournaments(response.tournaments);
        return response.tournaments;
      })
    );
  }

  deleteJourney(tournamentId: string): Observable<void> {
    const headers = {
      'Content-Type': 'application/json',
      'x-token': localStorage.getItem('token') || ''
    }

    return this.http.delete<void>(`${this.baseUrl}/api/tournaments/${tournamentId}`, { headers }).pipe(
      map(() => {
        this.tournaments.update(list => list.filter(t => t.tournamentId !== tournamentId));
      })
    );
  }

}
