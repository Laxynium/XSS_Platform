import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavItemComponent } from './nav-item/nav-item.component';
import { Level1Component } from './levels/level1/level1.component';
import { Level2Component } from './levels/level2/level2.component';
import { Level3Component } from './levels/level3/level3.component';
import { FormsModule } from '@angular/forms';
import { SafePipe } from './safe-pipe.pipe';

import { StoreModule } from '@ngrx/store';
import { scoreReducer } from './score.reducer';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    NavItemComponent,
    Level1Component,
    Level2Component,
    Level3Component,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot({ score: scoreReducer })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
