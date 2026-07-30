import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './pages/user-list/user-list.component';
import { NoteOneListComponent } from './pages/note-one-list/note-one-list.component';
import { NoteTwoListComponent } from './pages/note-two-list/note-two-list.component';
import { NoteThreeListComponent } from './pages/note-three-list/note-three-list.component';
import { NotesListComponent } from './pages/notes-list/notes-list.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { CreateNoteComponent } from './pages/create-note/create-note.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { SelectTypeComponent } from './components/select-type/select-type.component';
import { CreateTeamComponent } from './pages/create-team/create-team.component';
import { TeamListComponent } from './pages/team-list/team-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateMatchComponent } from './pages/create-match/create-match.component';
import { ListMatchComponent } from './pages/list-match/list-match.component';
import { ResultsComponent } from './pages/results/results.component';
import { TicketCardComponent } from './components/ticket-card/ticket-card.component';


@NgModule({
  declarations: [
    UserListComponent,
    NoteOneListComponent,
    NoteTwoListComponent,
    NoteThreeListComponent,
    NotesListComponent,
    CreateUserComponent,
    CreateNoteComponent,
    DashboardLayoutComponent,
    TableListComponent,
    SelectTypeComponent,
    CreateTeamComponent,
    TeamListComponent,
    CreateMatchComponent,
    ListMatchComponent,
    ResultsComponent,
    TicketCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
