import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export class Hints {

}

@Injectable({
  providedIn: 'root'
})
export class HintsService {
  constructor(private httpClient: HttpClient) {
  }

  useHint(levelNumber: number, levelToken: string, hintNumber: number): void {
    this.httpClient.post(
      new URL('/users/me/levels/use-hint', environment.backendUrl).href,
      {
        levelNumber,
        levelToken,
        hintNumber
      },
      { withCredentials: true }
    ).subscribe();
    console.log("POST HINT")
  }
}
