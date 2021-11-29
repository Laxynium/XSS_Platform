import { LevelFrontend } from './../levels';
import { Component, OnInit} from '@angular/core';
import { LevelService } from '../level.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  levels: LevelFrontend[] = [];
  score: Observable<number>;

  constructor(private levelService: LevelService, private store: Store<{ score: number }>) {
    this.levelService.levels$.subscribe(levels => {
      console.log("LEVELS")
      console.log(levels)
      this.levels = levels;
   });

    this.score = store.select('score');
  }

  ngOnInit(): void {}

  onClick(clickedLevel: LevelFrontend): void {
    this.levelService.changeSelectedLevel(clickedLevel.levelNumber);
  }
}
