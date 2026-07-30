import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../../services/team.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrl: './create-team.component.css'
})
export class CreateTeamComponent implements OnInit {

  teamForm: FormGroup;
  isEditMode = false;
  teamId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      shortName: ['', Validators.required],
      logo: ['',],
      league: [''],
      stadium: [''],
      enabled: [true]
    });
  }

   
  ngOnInit() {
    this.teamId = this.route.snapshot.paramMap.get('teamId');
    if (this.teamId) {
      this.isEditMode = true;
      const team = this.teamService.teamList().find(team => team.teamId === this.teamId);
      console.info('Equipo encontrado para edición:', team);
      if (team) {
        this.teamForm.patchValue({
          name: team.name,
          shortName: team.shortName,
          logo: team.logo,
          league: team.league,
          stadium: team.stadium,
          enabled: team.enabled
        });
      }
    }
  }

  get f() {
    return this.teamForm.controls;
  }

  onSubmit(): void {
    if (this.teamForm.invalid) return;

    if (this.isEditMode) {
      this.teamService.updateTeam(this.teamId!, this.teamForm.value).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'El equipo se actualizó correctamente', 'success');
          this.router.navigate(['/dashboard/teams']);
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el equipo', 'error');
        }
      });
    } else {
      this.teamService.createTeam(this.teamForm.value).subscribe({
        next: () => {
          Swal.fire('Creado', 'El equipo se creó correctamente', 'success');
          this.router.navigate(['/dashboard/teams']);
        },
        error: () => {
          Swal.fire('Error', 'No se pudo crear el equipo', 'error');
        }
      });
    }
  }

}
