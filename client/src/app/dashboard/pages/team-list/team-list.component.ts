import { Component, computed, inject, OnInit } from '@angular/core';
import { Team } from '../../interfaces/team.interface';
import { TeamService } from '../../services/team.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css'
})
export class TeamListComponent implements OnInit {

  private authService = inject(AuthService);

  isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');

  constructor(
    private teamService: TeamService,
    private router: Router
) {}

  teams: Team[] = []
  loading: boolean = false;
  error: string = '';

  ngOnInit() {
    this.loadTeams();
  }
  
  loadTeams() {
    this.loading = true;
    this.error = '';
    this.teamService.getTeams().subscribe({
      next: teams => {
        this.teams = teams;
        this.loading = false;
      },
      error: err => {
        this.error = 'Error loading teams';
        this.loading = false;
      }
    });
  }

  editTeam( teamId: string) {
    // Lógica para editar el equipo
    console.log('Editar equipo:', teamId);
    this.router.navigate(['/dashboard/team-list', teamId, 'edit']);
  }

  deleteTeam(team: string) {
    Swal.fire({
      title: '¿Eliminar equipo?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.teamService.deleteTeam(team).subscribe({
          next: () => {
            this.teams = this.teams.filter(t => t.teamId !== team);
            Swal.fire('Eliminado', 'El equipo se ha eliminado correctamente.', 'success');
          },
          error: err => {
            console.error('Error al eliminar el equipo:', err);
            Swal.fire('Error', 'No se pudo eliminar el equipo.', 'error');
          }
        });
      }
    });

  } 

}
