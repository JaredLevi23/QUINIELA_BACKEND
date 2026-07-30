
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Note } from '../interfaces/note.interface';
import { environments } from '../../../../environments/environments';


@Injectable({providedIn: 'root'})
export class DashboardService {

    private readonly baseUrl: string = environments.baseUrl;

    constructor( private http: HttpClient ) { }

    getNotesbyPage( page: number ): Observable<Note[]> {
        const url = `${this.baseUrl}/notes}`;
        return this.http.get<Note[]>(url)
            .pipe(
                catchError( _ => of([]) )
            );
    }


    getByNoteType( type: string ): Observable<Note[]> {
        const url = `${this.baseUrl}/notes?type=${type}`;
        return this.http.get<Note[]>(url)
            .pipe(
                catchError( _ => of([]) )
            );
    }


    createNote( note: Note ): Observable<Note | null > {
        const url = `${this.baseUrl}/notes`;
        return this.http.post<Note>(url, note)
            .pipe(
                tap( note => console.log('Note created: ', note )),
                catchError( _ => of(null) )
            );
    }


    createNoteWithSound( note: Note, sound: File ): Observable<Note | null> {
        const url = `${this.baseUrl}/notes`;
        const formData = new FormData();
        formData.append('sound', sound);
        formData.append('note', JSON.stringify(note));
        return this.http.post<Note>(url, formData)
            .pipe(
                tap( note => console.log('Note created: ', note )),
                catchError( _ => of(null) )
            );
    }
    
}