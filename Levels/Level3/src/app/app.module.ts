import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {SafePipe} from "./safe-pipe.pipe";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [AppComponent, SafePipe, SafePipe],
  imports: [BrowserModule, HttpClientModule, CommonModule, CommonModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
