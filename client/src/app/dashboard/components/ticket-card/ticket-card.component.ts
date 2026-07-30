import { Component, Input, inject } from '@angular/core';
import { Match } from '../../interfaces/match.interface';
import { TicketService } from '../../services/ticket.service';
import Swal from 'sweetalert2';

type PredictionResult = 'HOME_WIN' | 'DRAW' | 'AWAY_WIN';

@Component({
  selector: 'app-ticket-card',
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.css'
})
export class TicketCardComponent {

  @Input() matchs: Match[] = [];
  @Input() tournamentId: string = '';

  private ticketService = inject(TicketService);

  nickName = '';
  saving = false;
  private selections: { [matchId: string]: PredictionResult } = {};

  selectResult(matchId: string, result: PredictionResult): void {
    this.selections[matchId] = result;
  }

  isSelected(matchId: string, result: PredictionResult): boolean {
    return this.selections[matchId] === result;
  }

  get isComplete(): boolean {
    return this.nickName.trim().length > 0
      && this.matchs.length > 0
      && this.matchs.every(m => !!this.selections[m.matchId]);
  }

  saveTicket(): void {
    if (!this.isComplete || this.saving) return;

    this.saving = true;
    const predictions = this.matchs.map(m => ({
      matchId: m.matchId,
      result: this.selections[m.matchId]
    }));

    this.ticketService.createTicket({
      tournamentId: this.tournamentId,
      nickName: this.nickName.trim(),
      folio: '',
      predictions: predictions as any
    }).subscribe({
      next: () => {
        this.saving = false;
        Swal.fire('Guardado', 'El ticket se creó correctamente', 'success');
      },
      error: () => {
        this.saving = false;
        Swal.fire('Error', 'No se pudo crear el ticket', 'error');
      }
    });
  }

}
