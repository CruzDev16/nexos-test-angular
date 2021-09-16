import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.API_URL + '/api/user';

  constructor( private http: HttpClient ) { }

  getUsers(): Observable<User[]> {

    return this.http.get<User[]>(`${ this.API_URL }/list`)
    .pipe(
      catchError( this.handleError )
    );
  }

  private handleError( error: HttpErrorResponse ) {

    if (error.status === 0) {     
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

}
