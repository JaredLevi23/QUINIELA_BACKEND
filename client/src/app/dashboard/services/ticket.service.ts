import { Injectable, signal } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Ticket } from '../interfaces/ticket.interface';
import { map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TicketResponse } from '../interfaces/ticket.response.interface';
import { TicketCreateResponse } from '../interfaces/ticket.create.response.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private readonly baseUrl: string = environments.baseUrl;
  constructor( private http: HttpClient ) { }

  private ticketsCache: { [tournamentId: string]: Ticket[] } = {};

  tickets = signal<Ticket[]>([]);

  getTicketsByTournament(tournamentId: string) : Observable<Ticket[]> {
    if (this.ticketsCache[tournamentId]) {
      this.tickets.set(this.ticketsCache[tournamentId]);
      return of(this.ticketsCache[tournamentId]);
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'x-token': localStorage.getItem('token') || ''
    };

    return this.http.get<TicketResponse>(`${this.baseUrl}/api/tickets/${tournamentId}`, { headers })
    .pipe(
      map(response => {
        console.log('Tickets recibidos del backend:', response.tickets);
        this.tickets.set(response.tickets);
        this.ticketsCache[tournamentId] = response.tickets;
        return response.tickets;
      })
    );
  }

  createTicket(ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.post<TicketCreateResponse>(`${this.baseUrl}/api/tickets`, ticket, {
      headers: {
        'Content-Type': 'application/json',
        'x-token': localStorage.getItem('token') || ''
      }
    }).pipe(
      map(response => {
        this.tickets.update(list => [...list, response.ticket]);
        return response.ticket;
      })
    );
  }


  deleteTicket(ticketId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/tickets/${ticketId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-token': localStorage.getItem('token') || ''
      }
    }).pipe(
      map(() => {
        this.tickets.update(list => list.filter(ticket => ticket.ticketId !== ticketId));
      })
    );
  }


}
