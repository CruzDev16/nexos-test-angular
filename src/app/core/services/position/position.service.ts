import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Position } from 'src/app/shared/models/position.model';
import { MessageResponse } from 'src/app/shared/models/response/message.response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private API_URL = environment.API_URL + '/api/position';

  constructor( private http: HttpClient ) { }

  getPositions(): Observable<Position[]> {

    return this.http.get<Position[]>(`${ this.API_URL }/list`)
    .pipe(
      catchError( this.handleError )
    );
  }

  getPosition( id: number ): Observable<Position> {

    return this.http.get<Position>(`${ this.API_URL }/by-id/${ id }`)
    .pipe(
      catchError( this.handleError )
    );
  }

  savePosition( position: Position ): Observable<MessageResponse> {

    return this.http.post<MessageResponse>(`${ this.API_URL }/save`, position)
      .pipe(
        catchError( this.handleError )
      );
  }

  updatePosition( position: Position ): Observable<MessageResponse> {
    
    return this.http.put<MessageResponse>(`${ this.API_URL }/update/${ position.id }`, position)
      .pipe(
        catchError( this.handleError )
      );
  }

  deletePosition( id: number ): Observable<MessageResponse> {

    return this.http.delete<MessageResponse>(`${ this.API_URL }/delete/${ id }`)
      .pipe(
        catchError( this.handleError )
      );
  }

  private handleError( error: HttpErrorResponse ) {
    console.log( error );
    if (error.status === 0) {     
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.message}`);
    }
    return throwError(
      error.error.message);
  }

}
