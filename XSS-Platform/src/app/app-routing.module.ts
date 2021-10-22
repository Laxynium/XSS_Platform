import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Level1Component } from './levels/level1/level1.component';
import { Level2Component } from './levels/level2/level2.component';
import { Level3Component } from './levels/level3/level3.component';

const routes: Routes = [
  {
    path: "",
    component: Level1Component
  },
  {
    path: "level1",
    component: Level1Component
  },
  {
    path: "level2",
    component: Level2Component
  },
  {
    path: "level3",
    component: Level3Component
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
