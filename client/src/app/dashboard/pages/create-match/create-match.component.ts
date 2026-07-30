import { Component, computed, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchService } from '../../services/match.service';
import { TeamService } from '../../services/team.service';
import { Team } from '../../interfaces/team.interface';
import { JourneyService } from '../../services/journey.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-match',
  templateUrl: './create-match.component.html',
  styleUrl: './create-match.component.css'
})
export class CreateMatchComponent implements OnInit {

  matchForm: FormGroup;
  teams : Team[] = [];
  tournaments = computed(() => this.journeyService.tournaments());

  constructor(
    private fb: FormBuilder, 
    private matchService: MatchService, 
    private teamService: TeamService, 
    private journeyService: JourneyService) {
    this.matchForm = this.fb.group({
      homeTeam: ['', Validators.required],
      awayTeam: ['', Validators.required],
      tournamentId: ['', Validators.required],
      matchDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.teamService.getTeams().subscribe(teams => {
      this.teams = teams;
    });
  }

  onSubmit() {
    if (this.matchForm.valid) {
      this.matchService.createMatch(this.matchForm.value).subscribe(
        response => {
          console.log('Partido creado:', response);
          this.matchForm.reset();
          Swal.fire('Encuentro creado', 'El encuentro se creó correctamente', 'success');
        },
        error => {
          console.error('Error al crear el partido:', error);
          Swal.fire('Error', 'No se pudo crear el encuentro', 'error');
        }
      );
    }
  }

}
