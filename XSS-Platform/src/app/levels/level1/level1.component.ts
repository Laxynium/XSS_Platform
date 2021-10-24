import { LevelService } from './../../level.service';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/score.actions';

@Component({
  selector: 'app-level1',
  templateUrl: './level1.component.html',
  styleUrls: ['./level1.component.scss']
})
export class Level1Component implements OnInit {
  // Example solution
  // <img src=X onerror="alert()">
  providedString: string = '';
  completed: boolean = false;
  usedHints: number[] = [];
  hints: string[] = ["Try to use image tag.", "Give it an error property.", "Put alert() inside onerror."];

  @ViewChild('input') inputElement!: ElementRef;
  @ViewChild('hintBox') hintBoxElement!: ElementRef;

  constructor(public levelService: LevelService, private zone: NgZone, private router: Router, private store: Store<{ score: number }>) {
    const originalAlert = alert;
    window.alert = () => {
      originalAlert('Success!');
      this.zone.run(() => {
        this.store.dispatch(increment({ byScore: this.hints.length }));
        this.levelService.updateLevel(1, true, this.hints.length);
        this.completed = true;
      });
    }
  }

  ngOnInit(): void {
    this.completed = this.levelService.isLevelCompleted(1);
  }

  showHint(): void {
    this.usedHints.push(1);
    const hint = this.hints.shift();
    if(hint) this.hintBoxElement.nativeElement.innerHTML += `<div class="paragraph-text">${hint}</div>`
  }

  verify(): void {
    this.providedString = this.inputElement.nativeElement.value;
  }

  goToNextLevel(): void {
    this.levelService.changeSelectedLevel(2);
    this.router.navigate(['/level2']);
  }
}
