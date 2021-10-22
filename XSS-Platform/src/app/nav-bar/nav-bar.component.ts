import { Level } from './../levels';
import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Input() selectedLevel: number = 1;
  @Output() selectedLevelChange = new EventEmitter<number>();
  @Input() levels: Level[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  onClick(clickedLevel: Level): void {
    this.levels.forEach(level => {
      if(level.levelNumber == clickedLevel.levelNumber) {
        level.isSelected = true;
        this.selectedLevel = level.levelNumber;
      } else {
        level.isSelected = false;
      }
      this.selectedLevelChange.emit(this.selectedLevel);
    });
  }
}
