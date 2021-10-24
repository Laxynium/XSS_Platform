import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'XSS-Platform';
  score$: Observable<number>;

  @Input() selectedLevel: number = 1;
  constructor(private store: Store<{ score: number }>) {
    this.score$ = store.select('score');
    // console.log(this.score)
  }
  // @Input() levels: Level[] = [
  //   {levelRoute: '/level1', levelNumber: 1, isCompleted: false, isSelected: true},
  //   {levelRoute: '/level2', levelNumber: 2, isCompleted: false, isSelected: false},
  //   {levelRoute: '/level3', levelNumber: 3, isCompleted: false, isSelected: false}
  // ];
}
