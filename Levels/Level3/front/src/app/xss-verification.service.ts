import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class XssVerification {
  constructor(private httpClient: HttpClient) {}
  verify(
    payload: string,
    levelToken: string
  ): Observable<{ validationResult: string | null, messages: string[] }> {
    return this.httpClient
      .post<{ validationResult: string | null, messages: string[] }>(
        'verify',
        {
          payload: payload,
          levelToken: levelToken,
        },
        { withCredentials: true }
      )
      .pipe(
        catchError((error) => {
          console.log(error);
          return of({ validationResult: null, messages: []});
        })
      );
  }
}
