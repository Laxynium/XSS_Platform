import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface Level {
  number: number;
  completed: boolean;
  token: string;
  usedHints: { levelNumber: number; value: string }[];
}

export interface User {
  id: string;
  name: string;
  levels: Level[];
  challengeCompleted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user$: BehaviorSubject<User | null>;
  public get user$(): Observable<User | null> {
    return this._user$.asObservable();
  }

  constructor(private httpClient: HttpClient) {
    this._user$ = new BehaviorSubject<User | null>(null);
  }

  getLoadUser(): Observable<void> {
    return this.httpClient
      .get<User>(new URL('/users/me', environment.backendUrl).href, {
        withCredentials: true,
      })
      .pipe(
        catchError((e) => {
          console.log(e);
          return this.httpClient.post(
            new URL('/users/register', environment.backendUrl).href,
            {
              name: 'test',
            },
            { withCredentials: true }
          );
        }),
        tap((user) => {
          console.log("TAP")
          console.log(user)
          this._user$.next(user as User);
        }),
        map((_) => {})
      );
  }
}
