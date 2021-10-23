import { LevelService } from './../../level.service';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';

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

  @ViewChild('input') inputElement!: ElementRef;

  constructor(public levelService: LevelService, private zone: NgZone) {
    const originalAlert = alert;
    window.alert = () => {
      originalAlert('Success!');
      this.zone.run(() => {
        this.levelService.updateLevel(1, true);
        this.completed = true;
      });
    }
  }

  ngOnInit(): void {
    this.completed = this.levelService.isLevelCompleted(1);
  }

  verify(): void {
    this.providedString = this.inputElement.nativeElement.value;
  }
}
