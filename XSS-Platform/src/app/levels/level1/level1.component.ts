import { SERVER_URL } from './../../constants';
import { LevelService } from './../../level.service';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/score.actions';
import b64ToBlob from "b64-to-blob";
import { saveAs } from 'file-saver';
import axios, { AxiosRequestConfig } from 'axios';

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

// Payload, eg list of docs to zip

// Axios options
const axiosOptions: AxiosRequestConfig = {
  responseType: 'arraybuffer',
  headers: {
    'Content-Type': 'application/json'
  }
}

  axios
    .get(requestURL, axiosOptions)
    .then((response) => {
      const blob = new Blob([response.data], {
        type: 'application/octet-stream'
      })
      const filename = 'download.zip'
      saveAs(blob, filename)
    })
    .catch((e) => {
    });
  }

  goToNextLevel(): void {
    this.levelService.changeSelectedLevel(2);
    this.router.navigate(['/level2']);
  }
}
