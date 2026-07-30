import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JourneyService } from '../../services/journey.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrl: './create-note.component.css'
})
export class CreateNoteComponent {

  noteTypeSelected: string = '';
  tournamentForm: FormGroup;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, private journeyService: JourneyService) {
    this.tournamentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  changeNoteType(event: string) {
    this.noteTypeSelected = event;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files && input.files.length > 0 ? input.files[0] : null;
  }

  onSubmitTournament() {
    if (!this.tournamentForm.valid) return;

    if (this.selectedFile) {
      this.submitWithFile(this.selectedFile);
    } else {
      this.submitNormal();
    }
  }

  private submitNormal() {
    const tournamentData = this.tournamentForm.value;
    this.journeyService.createJourney(tournamentData).subscribe({
      next: response => {
        console.log('Torneo creado:', response);
        this.resetForm();
        Swal.fire('Torneo creado', 'El torneo se creó correctamente', 'success');
      },
      error: err => {
        console.error('Error al crear el torneo:', err);
        Swal.fire('Error', 'No se pudo crear el torneo', 'error');
      }
    });
  }

  private submitWithFile(file: File) {
    const { name, startDate, endDate } = this.tournamentForm.value;

    this.journeyService.uploadTournamentFile(
      file,
      name,
      this.toDisplayDate(startDate),
      this.toDisplayDate(endDate)
    ).subscribe({
      next: response => {
        console.log('Torneo creado desde archivo:', response);
        this.journeyService.loadJourneys().subscribe();
        this.resetForm();
        Swal.fire('Torneo creado', 'El torneo se creó correctamente a partir del archivo', 'success');
      },
      error: err => {
        console.error('Error al crear el torneo desde archivo:', err);
        Swal.fire('Error', 'No se pudo crear el torneo a partir del archivo', 'error');
      }
    });
  }

  // Convierte una fecha nativa yyyy-MM-dd a dd/MM/yyyy, formato que espera este endpoint
  private toDisplayDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }

  private resetForm() {
    this.tournamentForm.reset();
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

}
