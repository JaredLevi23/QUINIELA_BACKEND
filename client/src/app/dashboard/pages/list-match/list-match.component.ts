import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { Tournament } from '../../interfaces/tournament.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { Match } from '../../interfaces/match.interface';
import { JourneyService } from '../../services/journey.service';
import { AuthService } from '../../../auth/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-list-match',
  templateUrl: './list-match.component.html',
  styleUrls: ['./list-match.component.css']
})
export class ListMatchComponent {

  private authService = inject(AuthService);

  isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');

  tournament: string = '';
  matchs = computed(() => this.matchesService.matchList());

  constructor( private router: Router, private route: ActivatedRoute, private matchesService: MatchService, private jour: JourneyService ) {
    this.route.params.subscribe(params => {
      this.tournament = params['tournamentId'];
      console.log("inicializando componente de lista" + this.tournament);
      this.loadMatchs( this.tournament );
    });
  }

  loadMatchs(tournamentId: string) {
    // Reemplaza con tu servicio HTTP
     this.matchesService.getMatchesByTournament(tournamentId).subscribe({
       next: matchs => {
         console.log('Partidos cargados para el torneo:', matchs);
       },
       error: err => {
         console.error('Error al cargar los partidos para el torneo:', err);
       }
     });
   }

  // getTeamName(teamId: string): string {
  //   return "";
  // }

  // getTournamentName(tournamentId: string): string {
  //   return this.tournaments.get(tournamentId) || 'Torneo desconocido';
  // }

  editMatch(match: Match) {
    const homeName = match.homeTeam.name || 'Equipo A';
    const awayName = match.awayTeam.name || 'Equipo B';

    Swal.fire({
      title: `${homeName} vs ${awayName}`,
      html: `
        <div style="display:flex; justify-content:center; align-items:center; gap:20px;">
          <div style="text-align:center;">
            <img src="${match.homeTeam.logo || '/assets/soccer.png'}" alt="Local" style="width:60px; height:60px; object-fit:contain; margin-bottom:6px;">
            <input id="swal-input1" type="number" class="swal2-input" style="width:80px;" value="${(match.homeScore) ?? ''}">
          </div>
          <div style="text-align:center;">
            <img src="${match.awayTeam.logo || '/assets/soccer.png'}" alt="Visitante" style="width:60px; height:60px; object-fit:contain; margin-bottom:6px;">
            <input id="swal-input2" type="number" class="swal2-input" style="width:80px;" value="${(match.awayScore) ?? ''}">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const val1 = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const val2 = (document.getElementById('swal-input2') as HTMLInputElement).value;

        if (val1 === '' || val2 === '') {
          Swal.showValidationMessage('Debes ingresar ambos valores');
          return;
        }
        return {
          value1: Number(val1),
          value2: Number(val2)
        };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        (match as any).score1 = result.value.value1;
        (match as any).score2 = result.value.value2;

        const matchEdited: Match = {
          ...match,
          homeScore: result.value.value1,
          awayScore: result.value.value2
        };

        this.matchesService.updateMatch(match.matchId, matchEdited).subscribe({
          next: updatedMatch => {
            console.log('Partido actualizado:', updatedMatch);
            Swal.fire('Guardado', 'Los valores se actualizaron correctamente', 'success');
          },
          error: err => {
            console.error('Error al actualizar el partido:', err);
            Swal.fire('Error', 'Hubo un error al actualizar el partido', 'error');
          }
        });

      }
    });
  }

  deleteMatch(match: Match) {
    Swal.fire({
      title: '¿Eliminar partido?',
      text: `Se eliminará el partido ${match.homeTeam.name} vs ${match.awayTeam.name}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.matchesService.deleteMatch(match.matchId).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El partido fue eliminado correctamente.', 'success');
          },
          error: err => {
            console.error('Error al eliminar el partido:', err);
            Swal.fire('Error', 'No se pudo eliminar el partido.', 'error');
          }
        });
      }
    });
  }

  gotoResults() {
    this.router.navigate(['/dashboard/results', this.tournament]);
  }

  gotoMatches() {
    this.router.navigate(['/dashboard/match-list', this.tournament  ]);
  }

}