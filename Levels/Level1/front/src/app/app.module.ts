import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SafePipe } from './safe-pipe.pipe';
import { XssVerification } from './xss-verification.service';

@NgModule({
  declarations: [AppComponent, SafePipe],
  imports: [BrowserModule, HttpClientModule],
  providers: [XssVerification],
  bootstrap: [AppComponent],
})
export class AppModule {}
