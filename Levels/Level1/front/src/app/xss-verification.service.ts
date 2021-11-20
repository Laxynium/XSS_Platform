import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class XssVerification {
  constructor(private httpClient: HttpClient) {}
  verify(payload: string): Observable<{ validationResult: string }> {
    return this.httpClient.post<{ validationResult: string }>('verify', {
      payload: payload,
    });
  }
}
