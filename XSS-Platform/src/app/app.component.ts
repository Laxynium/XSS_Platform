import { Level } from './levels';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'XSS-Platform';

  @Input() selectedLevel: number = 1;

  // @Input() levels: Level[] = [
  //   {levelRoute: '/level1', levelNumber: 1, isCompleted: false, isSelected: true},
  //   {levelRoute: '/level2', levelNumber: 2, isCompleted: false, isSelected: false},
  //   {levelRoute: '/level3', levelNumber: 3, isCompleted: false, isSelected: false}
  // ];
}
