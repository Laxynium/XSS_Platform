import { SERVER_URL } from './../../constants';
import { LevelService } from './../../level.service';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/score.actions';
import b64ToBlob from "b64-to-blob";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-level1',
  templateUrl: './level1.component.html',
  styleUrls: ['./level1.component.scss']
})
export class Level1Component implements OnInit {
  // Example solution
  // <img src=X onerror="alert()">
  completed: boolean = false;
  usedHints: number[] = [];
  hints: string[] = ["Sprobuj uzyć taga <img>.", "Waznym elementem jest 'onerror' event.", "Podaj funkcje alert() wewnatrz 'onerror' i 'src', który nie istnieje."];

  @ViewChild('hintBox') hintBoxElement!: ElementRef;

  constructor(public levelService: LevelService, private zone: NgZone, private router: Router, private store: Store<{ score: number }>) {

    window.addEventListener("message", (event) => {
      if (event.data === "success") {
        this.store.dispatch(increment({ byScore: this.hints.length }));
        this.levelService.updateLevel(1, true, this.hints.length);
        this.completed = true;
        return;
      }
    }, false);
  }

  ngOnInit(): void {
    this.completed = this.levelService.isLevelCompleted(1);
  }

  showHint(): void {
    this.usedHints.push(1);
    const hint = this.hints.shift();
    if(hint) this.hintBoxElement.nativeElement.innerHTML += `<div class="paragraph-text">${hint}</div>`
  }

  async getLevelFiles(): Promise<void> {
    const requestURL = SERVER_URL + '/files/1';
    fetch(requestURL)
    .then((response) => {
      console.log(response)
      return response.text();
    })
    .then((zipAsBase64) => {
      const content = window.btoa(unescape(encodeURIComponent(zipAsBase64)));
      const blob = b64ToBlob(content, "application/zip");
      saveAs(blob, `level1.zip`);
    });
  }

  goToNextLevel(): void {
    this.levelService.changeSelectedLevel(2);
    this.router.navigate(['/level2']);
  }
}
