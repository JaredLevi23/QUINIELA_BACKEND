import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { Tournament } from '../../interfaces/tournament.interface';
import { JourneyService } from '../../services/journey.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css'
})
export class NotesListComponent{

  private authService = inject(AuthService);

  isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');

 tournaments = computed(() => this.journeyService.tournaments());
 isLoading = computed(() => this.journeyService.loading());

  constructor( private journeyService: JourneyService, private router: Router ) {}

  searchTournament(term: string) {
    console.log('Buscar:', term);
  }

  editTournament(tournamentId: string) {
    console.log('Editar:', tournamentId);
  }

  deleteTournament(tournamentId: string) {
    Swal.fire({
      title: '¿Eliminar torneo?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.journeyService.deleteJourney(tournamentId).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El torneo se eliminó correctamente.', 'success');
          },
          error: err => {
            console.error('Error al eliminar el torneo:', err);
            Swal.fire('Error', 'No se pudo eliminar el torneo.', 'error');
          }
        });
      }
    });
  }

  gotoResults(tournamentId: string) {
    this.router.navigate(['/dashboard/results', tournamentId]);
  }
}



