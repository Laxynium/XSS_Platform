import { Level } from './../levels';
import { Component, OnInit} from '@angular/core';
import { LevelService } from '../level.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  levels: Level[] = [];

  constructor(public levelService: LevelService) {
    this.levels = levelService.getLevels();
   }

  ngOnInit(): void {
  }

  onClick(clickedLevel: Level): void {
    this.levelService.changeSelectedLevel(clickedLevel.levelNumber);
  }
}
