import { Component, Input } from '@angular/core';
import { Country } from '../../../countries/interfaces/country.interface';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrl: './table-list.component.css'
})
export class TableListComponent {

  @Input()
  public countries: Country[] = [];

  @Input()
  public title: String = 'Titulo';
}
