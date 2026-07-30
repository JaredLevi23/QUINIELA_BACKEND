import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';

@Injectable({providedIn: 'root'})
export class CountriesService {

    private apiUrl = 'https://restcountries.com/v3.1';

    constructor( private http: HttpClient ) { }

    searchCapital( capital: string ): Observable<Country[]> {
        const url = `${this.apiUrl}/capital/${capital}`;
        return this.http.get<Country[]>(url)
            .pipe(
                catchError( _ => of([]) )
            );
    }
    
}