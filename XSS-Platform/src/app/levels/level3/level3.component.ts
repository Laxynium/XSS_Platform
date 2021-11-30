import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {LevelService} from "../../level.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {increment} from "../../score.actions";
import {SERVER_URL} from "../../constants";
import axios, {AxiosRequestConfig} from "axios";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-level3',
  templateUrl: './level3.component.html',
  styleUrls: ['./level3.component.scss']
})
export class Level3Component implements OnInit {
  completed: boolean = false;
  usedHints: number[] = [];
  hints: string[] = ["Post malicious message to the backend", "This message will be stored in database", "Post js script code"];

  @ViewChild('hintBox') hintBoxElement!: ElementRef;

  constructor(public levelService: LevelService, private zone: NgZone, private router: Router, private store: Store<{ score: number }>) {

    window.addEventListener("message", (event) => {
      if (event.data === "success") {
        this.store.dispatch(increment({ byScore: this.hints.length }));
        this.levelService.updateLevel(3, true, this.hints.length);
        this.completed = true;
        return;
      }
    }, false);
  }

  ngOnInit(): void {
    this.completed = this.levelService.isLevelCompleted(3);
  }

  showHint(): void {
    this.usedHints.push(1);
    const hint = this.hints.shift();
    if(hint) this.hintBoxElement.nativeElement.innerHTML += `<div class="paragraph-text">${hint}</div>`
  }

  async getLevelFiles(): Promise<void> {
    const requestURL = SERVER_URL + '/files/3';

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
        const filename = 'level3.zip'
        saveAs(blob, filename)
      })
      .catch((e) => {
      });
  }
}
