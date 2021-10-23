import { Injectable } from '@angular/core';
import { Level } from './levels';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  levels: Level[] = [
    {levelRoute: '/level1', levelNumber: 1, isCompleted: false, isSelected: true},
    {levelRoute: '/level2', levelNumber: 2, isCompleted: false, isSelected: false},
    {levelRoute: '/level3', levelNumber: 3, isCompleted: false, isSelected: false}
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

  updateLevel(levelNumber: number, isCompleted: boolean): void {
    const found = this.levels.find(level => level.levelNumber == levelNumber);
    if(found) found.isCompleted = isCompleted;
  }
}
