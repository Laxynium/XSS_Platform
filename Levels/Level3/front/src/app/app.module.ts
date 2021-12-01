import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {SafePipe} from "./safe-pipe.pipe";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import { RouterModule, Routes } from '@angular/router';
import { NewMessageComponent } from './new-message/new-message.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MessagesComponent } from './messages/messages.component';

const routes: Routes = [
  { path: 'new-message', component: NewMessageComponent },
  { path: 'messages', component: MessagesComponent },
  { path: '**', redirectTo: 'messages' }
];

@NgModule({
  declarations: [AppComponent, SafePipe, SafePipe, NewMessageComponent, MessagesComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
