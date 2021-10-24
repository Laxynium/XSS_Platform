import { Injectable } from '@angular/core';
import { Level } from './levels';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  levels: Level[] = [
    {levelRoute: '/level1', levelNumber: 1, isCompleted: false, isSelected: true, numberOfHints: 0},
    {levelRoute: '/level2', levelNumber: 2, isCompleted: false, isSelected: false, numberOfHints: 0},
    {levelRoute: '/level3', levelNumber: 3, isCompleted: false, isSelected: false, numberOfHints: 0}
  ];

  constructor() {}


  isLevelCompleted(levelNumber: number): boolean {
    const found = this.levels.find(level => level.levelNumber == levelNumber);
    if(found) return found.isCompleted;
    return false;
  }

  getLevels(): Level[] {
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
