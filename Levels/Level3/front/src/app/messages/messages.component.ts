import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, MessagesService } from '../messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messages$ = this.messagesService.messages$;

  constructor(private messagesService: MessagesService) {
  }

  ngOnInit(): void {
    this.messagesService.loadMessages().subscribe();
  }

}
