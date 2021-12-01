import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit {

  formGroup = new FormGroup({
    'author': new FormControl(null, [Validators.required]),
    'content': new FormControl(null, [Validators.required])
  });

  constructor(private messages: MessagesService) { }

  ngOnInit(): void {
  }

  onSubmit(we:any){
    const {author, content} = this.formGroup.value;

    this.messages.addMessages({author: author, content: content});
  }

}
