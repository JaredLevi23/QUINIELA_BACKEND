import { Injectable, signal } from '@angular/core';
import { Team } from '../interfaces/team.interface';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TeamResponse } from '../interfaces/team.response.interface';
import { environments } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private readonly baseUrl: string = environments.baseUrl;
  teamList = signal<Team[]>([]);

  constructor(private http: HttpClient) {
      this.getTeams().subscribe({
        next: teams => {
          this.teamList.set(teams);
          console.log('Equipos cargados al iniciar TeamService:', this.teamList());
        },
        error: err => {
          console.error('Error al cargar los equipos al iniciar TeamService:', err);
        }
      });
  }

  getTeams(): Observable<Team[]> {
    const headers = {
      'Content-Type': 'application/json',
      'x-token': localStorage.getItem('token') || ''
    };
    console.log( headers);
    return this.http.get<TeamResponse>(this.baseUrl + '/api/teams', {
      headers: headers
    }).pipe(
      map(response => {
        this.teamList.set(response.teams);
        return this.teamList();
      })
    );
  }

  createTeam(team: Partial<Team>): Observable<Team> {
    return this.http.post<Team>(`${this.baseUrl}/api/teams`, team, {
      headers: {
        'Content-Type': 'application/json',
        'x-token': localStorage.getItem('token') || ''
      }
    }).pipe(
      map(createdTeam => {
        this.teamList.update(list => [...list, createdTeam]);
        return createdTeam;
      })
    );
  }

  updateTeam(teamId: string, team: Partial<Team>): Observable<Team> {
    return this.http.put<Team>(`${this.baseUrl}/api/teams/${teamId}`, team, {
      headers: {
        'Content-Type': 'application/json',
        'x-token': localStorage.getItem('token') || ''
      }
    });
  }

  deleteTeam(teamId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/teams/${teamId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-token': localStorage.getItem('token') || ''
      }
    });
  }

}
