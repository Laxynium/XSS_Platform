import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/user.service';
import { Injectable } from '@angular/core';
import { LevelFrontend } from './levels';
import { Level } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  levels: LevelFrontend[] = [];
  private _levels$: BehaviorSubject<LevelFrontend[]>;
  public get levels$(): Observable<LevelFrontend[]> {
    return this._levels$.asObservable();
  }
  constructor(private userService: UserService) {
    this._levels$ = new BehaviorSubject<LevelFrontend[]>([]);

    this.userService.user$.subscribe(user => {
      if(user) {
        this.levels = this.castToLevelFrontend(user.levels);
        this._levels$.next(this.levels as LevelFrontend[]);
      }
    });
  }

  castToLevelFrontend(levels: Level[]): LevelFrontend[] {
    const levelResult: LevelFrontend[] = [];
    levels.forEach(level => {
      const newLevel: LevelFrontend = {
        levelRoute: `/level${level.number}`,
        levelNumber: level.number,
        token: level.token,
        isCompleted: level.completed,
        isSelected: false,
        numberOfHints: level.usedHints.length
      }
      levelResult.push(newLevel);
    });
    return levelResult;
  }

  isLevelCompleted(levelNumber: number): boolean {
    const found = this.levels.find(level => level.levelNumber == levelNumber);
    if(found) return found.isCompleted;
    return false;
  }

  getLevels(): LevelFrontend[] {
    return this.levels;
  }

  updateLevel(levelNumber: number, isCompleted: boolean, numberOfHints: number): void {
    const found = this.levels.find(level => level.levelNumber == levelNumber);
    if(found) {
      found.isCompleted = isCompleted;
      found.numberOfHints = numberOfHints;
    }
  }

  changeSelectedLevel(levelNumber: number) {
    this.levels.forEach(level => {
      if(level.levelNumber == levelNumber) {
        level.isSelected = true;
      } else {
        level.isSelected = false;
      }
    });
  }
}
