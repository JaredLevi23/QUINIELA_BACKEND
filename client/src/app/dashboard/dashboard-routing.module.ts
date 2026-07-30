import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNoteComponent } from './pages/create-note/create-note.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { NoteOneListComponent } from './pages/note-one-list/note-one-list.component';
import { NoteTwoListComponent } from './pages/note-two-list/note-two-list.component';
import { NoteThreeListComponent } from './pages/note-three-list/note-three-list.component';
import { NotesListComponent } from './pages/notes-list/notes-list.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { CreateTeamComponent } from './pages/create-team/create-team.component';
import { TeamListComponent } from './pages/team-list/team-list.component';
import { ListMatchComponent } from './pages/list-match/list-match.component';
import { CreateMatchComponent } from './pages/create-match/create-match.component';
import { ResultsComponent } from './pages/results/results.component';
import { isAdminGuard } from '../auth/guards/is-admin.guard';



const routes : Routes = [
    {
        'path': '',
        'component': DashboardLayoutComponent,
        children:[
            {
                'path': 'create-note',
                'component': CreateNoteComponent,
                canActivate: [isAdminGuard]
            },
            {
                'path': 'create-user',
                'component': CreateUserComponent,
                canActivate: [isAdminGuard]
            },
            {
                'path': 'note-one-list',
                'component': NoteOneListComponent
            },
            {
                'path': 'note-two-list',
                'component': NoteTwoListComponent
            },
            {
                'path': 'note-three-list',
                'component': NoteThreeListComponent
            },
            {
                'path': 'notes-list',
                'component': NotesListComponent
            },
            {
                'path': 'users-list',
                'component': UserListComponent,
                canActivate: [isAdminGuard]
            },
            {
                'path': 'users-list/:userId/edit',
                'component': CreateUserComponent,
                canActivate: [isAdminGuard]
            },
            {
                'path': 'create-team',
                'component': CreateTeamComponent
            },
            {
                'path': 'team-list',
                'component': TeamListComponent
            },
            {
                'path': 'team-list/:teamId/edit',
                'component': CreateTeamComponent,
                canActivate: [isAdminGuard]
            },
            {
                'path': 'match-list/:tournamentId',
                'component': ListMatchComponent
            },
            {
                'path': 'create-match',
                'component': CreateMatchComponent,
                canActivate: [isAdminGuard]
            },
            {
                'path': 'results/:tournamentId',
                'component': ResultsComponent
            },
            {
                'path': '**',
                'redirectTo': 'notes-list'
            }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [],
})
export class DashboardRoutingModule { }
