import { ApplicationRef, Component, ComponentFactoryResolver, computed, Injector, Input } from '@angular/core';
import { MatchResponse } from '../../interfaces/match.response.interface';
import { Match } from '../../interfaces/match.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Tournament } from '../../interfaces/tournament.interface';
import { TicketResponse } from '../../interfaces/ticket.response.interface';
import { Prediction } from '../../interfaces/prediction.interface';
import { Ticket } from '../../interfaces/ticket.interface';
import { TicketService } from '../../services/ticket.service';
import { MatchService } from '../../services/match.service';
import { Team } from '../../interfaces/team.interface';
import Swal from 'sweetalert2';
import { TicketCardComponent } from '../../components/ticket-card/ticket-card.component';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {

  tournament: string = '';
  tickets = computed(() => this.ticketService.tickets() );
  matchs = computed(() => this.matchService.matchList() );

  constructor( 
    private router: Router, 
    private route: ActivatedRoute, 
    private ticketService: TicketService,
    private matchService: MatchService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {
    this.route.params.subscribe(params => {
      this.tournament = params['tournamentId'];
      console.log("inicializando componente de resultados para el torneo: " + this.tournament);
      this.getMatchesForTournament(this.tournament);
      this.getPredictionForTournament(this.tournament);
    });
  }

  isTableView = true;

  toggleView() {
    this.isTableView = !this.isTableView;
  }

  selectedTicket: Ticket | null = null;

  isPredictionCorrect(prediction: Prediction): boolean {
    const match = this.matchs().find(m => m.matchId === prediction.matchId);
    if (!match) return false;
    if (!this.hasMatchStarted(prediction.matchId)) return false;
    // Lógica: compara prediction.result con el resultado real
    if (prediction.result === 'HOME_WIN' && match.homeScore > match.awayScore) return true;
    if (prediction.result === 'AWAY_WIN' && match.homeScore < match.awayScore) return true;
    if (prediction.result === 'DRAW' && match.homeScore === match.awayScore) return true;
    return false;
  }

  hasMatchStarted(matchId: string): boolean {
    const match = this.matchs().find(m => m.matchId === matchId);
    if (!match) return false;
    return new Date(match.matchDate) <= new Date();
  }

  getPredictionForTournament(tournamentId: string){
    this.ticketService.getTicketsByTournament(tournamentId).subscribe({
      next: tickets => {
        console.log('Tickets cargados para el torneo:', tickets);
      },
      error: err => {
        console.error('Error al cargar los tickets para el torneo:', err);
      }
    });
  }

  getMatchesForTournament(tournamentId: string){
    this.matchService.getMatchesByTournament(tournamentId).subscribe({
      next: matchs => {
        console.log('Resultados cargados para el torneo:', matchs);
      },
      error: err => {
        console.error('Error al cargar los partidos para el torneo:', err);
      }
    });
  }



  getMatchResult(matchId: string): string {
    const match = this.matchs().find(m => m.matchId === matchId);
    if (!match) return 'DRAW';
    if (match.homeScore > match.awayScore) return 'HOME_WIN';
    if (match.homeScore < match.awayScore) return 'AWAY_WIN';
    return 'DRAW';
  }


  getTeamName(teamId: string): string {
    const match = this.matchs().find(m => m.homeTeam.teamId === teamId || m.awayTeam.teamId === teamId);
    if (!match) return 'Equipo desconocido';
    return match.homeTeam.teamId === teamId ? match.homeTeam.name : match.awayTeam.name;
  }


  getTeamNameByMatchs( matchId: string, teamType: 'LOCAL' | 'AWAY') : Team | null {
    const match = this.matchs().find(m => m.matchId === matchId);
    if (!match) return null;
    if ( teamType === 'LOCAL' ) {
      // retornar el nombre con 3 caracteres
      return match.homeTeam;
    } else {
      return match.awayTeam;
    }
  }

  getNumberOfPredictions(ticket: Ticket): number {
    return ticket.predictions.length;
  }


  getSuccessfulPredictions(ticket: Ticket): number {
    return ticket.predictions.filter(prediction => this.isPredictionCorrect(prediction)).length;
  }

  sortedTickets = computed(() => {
    return [...this.tickets()].sort(
      (a, b) => this.getSuccessfulPredictions(b) - this.getSuccessfulPredictions(a)
    );
  });



  gotoResults() {
    this.router.navigate(['/dashboard/results', this.tournament]);
  }

  gotoMatches() {
    this.router.navigate(['/dashboard/match-list', this.tournament]);
  }

  showCreateTicket() {
    Swal.fire({
      title: 'Crear Ticket',
      html: '<div id="ticket-component-container"></div>',
      width: '700px',
      confirmButtonText: 'Cerrar',
      didOpen: () => {
        this.attachTicketComponent();
      }
    });
  }

  private attachTicketComponent(): void {
    const container = document.getElementById('ticket-component-container');
    if (container) {
      const componentRef = this.componentFactoryResolver
        .resolveComponentFactory(TicketCardComponent)
        .create(this.injector);
      
      // Pasar los matches y el torneo al componente
      componentRef.instance.matchs = this.matchs();
      componentRef.instance.tournamentId = this.tournament;
      
      this.appRef.attachView(componentRef.hostView);
      container.appendChild((componentRef.hostView as any).rootNodes[0]);
    }
  }

}
