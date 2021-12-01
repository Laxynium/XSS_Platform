import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

export interface Message{
  author: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private _messages$ = new BehaviorSubject<Message[]>([])
  public get messages$(): Observable<Message[]>{
    return this._messages$.asObservable();
  };


  constructor(private client: HttpClient) {
  }

  public addMessages(message: Message): void{
    this.client.post('api/messages',
      message,
      { withCredentials: true }
    ).subscribe(r => {
      const messages = [message, ...this._messages$.value]
      this._messages$.next(messages);
    })
  }

  public loadMessages(): Observable<void>{
    return this.client.get<Message[]>('api/messages', { withCredentials: true })
    .pipe(tap(r=>{
      this._messages$.next(r)
    }), map(x=>{}))
  }
}
