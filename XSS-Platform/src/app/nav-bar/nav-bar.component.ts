import { UserService, Level } from 'src/app/user.service';
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
  score: number = 0;

  constructor(private levelService: LevelService, private userService: UserService, private store: Store<{ score: number }>) {
    this.levelService.levels$.subscribe(levels => {
      this.levels = levels;
   });

   this.userService.user$.subscribe(user => {
     if(user)
      this.score = this.calculateScore(user.levels);
   })
    // this.score = store.select('score');
  }

  ngOnInit(): void {}

  onClick(clickedLevel: LevelFrontend): void {
    this.levelService.changeSelectedLevel(clickedLevel.levelNumber);
  }

  private calculateScore(levels: Level[]): number {
    let score = 0;
    levels.forEach(level => {
      if(level.completed)
        score += (3 - level.usedHints.length);
    });
    return score;
  }
}
