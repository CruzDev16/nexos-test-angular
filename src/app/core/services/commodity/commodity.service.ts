import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Commodity } from 'src/app/shared/models/commodity.model';
import { MessageResponse } from 'src/app/shared/models/response/message.response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommodityService {

  private API_URL = environment.API_URL + '/api/commodity';

  constructor( private http: HttpClient ) { }

  getListCommodity( name: string, date: string, creatorUser: number ): Observable<Commodity[]> {

    const httpOptions = {
      params: new HttpParams()
        .set('name', name)
        .set('date', date)
        .set('creatorUser', creatorUser)
    };

    return this.http.get<Commodity[]>(`${ this.API_URL }/list`, httpOptions)
    .pipe(
      catchError( this.handleError )
    );
  }

  getCommodity( id: number ): Observable<Commodity> {

    return this.http.get<Commodity>(`${ this.API_URL }/by-id/${ id }`)
    .pipe(
      catchError( this.handleError )
    );
  }

  saveCommodity( commodity: Commodity ): Observable<MessageResponse> {

    return this.http.post<MessageResponse>(`${ this.API_URL }/save`, commodity)
      .pipe(
        catchError( this.handleError )
      );
  }

  updateCommodity( commodity: Commodity ): Observable<MessageResponse> {
    
    return this.http.put<MessageResponse>(`${ this.API_URL }/update/${ commodity.id }`, commodity)
      .pipe(
        catchError( this.handleError )
      );
  }

  deleteCommodity( id: number, creatorUserId: number ): Observable<MessageResponse> {

    return this.http.delete<MessageResponse>(`${ this.API_URL }/delete/${ id }/${ creatorUserId }`)
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
        `body was: ${error.error.message}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

}
