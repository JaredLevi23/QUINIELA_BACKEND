import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-select-type',
  templateUrl: './select-type.component.html',
  styleUrl: './select-type.component.css'
})
export class SelectTypeComponent {

  @Output()
  public onValue = new EventEmitter<string>();


  changeNoteType( type: string ) {
    console.log(type);
    this.onValue.emit( type );
  }


}
