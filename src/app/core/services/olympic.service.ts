import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class OlympicService {
private olympicUrl = './assets/mock/olympic.json';
private olympics$ = new BehaviorSubject<Olympic[]>([]);

constructor(private http: HttpClient, private router: Router) {}

loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
        tap((value) => this.olympics$.next(value)),
        catchError((error, caught) => {
            
            // redirect to error page
            this.olympics$.unsubscribe();
            this.router.navigate(['/error'], { state: { error: {message: error.message, name: error.name} } });

            return caught;
        })
    );
}

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
