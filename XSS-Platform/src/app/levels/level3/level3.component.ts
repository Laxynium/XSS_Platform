import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {LevelService} from "../../level.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {increment} from "../../score.actions";
import axios, {AxiosRequestConfig} from "axios";
import {saveAs} from "file-saver";
import {environment} from "../../../environments/environment";
import { Level, UserService } from 'src/app/user.service';
import { HintsService } from 'src/app/hints.service';

@Component({
  selector: 'app-level3',
  templateUrl: './level3.component.html',
  styleUrls: ['./level3.component.scss']
})
export class Level3Component implements OnInit {
  completed: boolean = false;
  usedHints: number[] = [];
  token: string = "";
  hints: string[] = ["Post malicious message to the backend", "This message will be stored in database", "Post js script code"];

  @ViewChild('hintBox') hintBoxElement!: ElementRef;
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;

  constructor(
    public levelService: LevelService,
    public hintsService: HintsService,
    private zone: NgZone,
    private router: Router,
    private store: Store<{ score: number }>,
    private userService: UserService
    ) {
    this.userService.user$.subscribe(user => {
      const level = user?.levels.find(level => level.number === 3);
      if(level) {
        this.completed = level.completed;
        this.token = level.token;
        this.calculateScore(level);
      }
    });

    window.addEventListener(
      'message',
      (event) => {
        if (event.data === 'success') {
          console.log(this.hints)
          console.log(this.usedHints)
          this.levelService.updateLevel(1, true, this.hints.length);
          this.userService.getLoadUser().subscribe();
          this.completed = true;
          return;
        }
      },
      false
    );

    this.userService.user$.subscribe((user) => {
      if (user) {
        const level = user.levels.find((l) => l.number == 3);
        if (!level) {
          return;
        }
        setTimeout( // using timeout to let iframe time to subscribe for message
          () => {
            if (!this.iframe) {
              return;
            }
            this.iframe.nativeElement.contentWindow?.postMessage(
              {
                type: 'level',
                level: level,
              },
              '*'
            );
          },
          1000
        );
      }
    });
  }

  ngOnInit(): void {
    this.completed = this.levelService.isLevelCompleted(3);
  }

  showHint(): void {
    const hint = this.hints.shift();
    if (hint) {
      this.usedHints.push(1);
      this.hintsService.useHint(3, this.token, this.usedHints.length);
      this.hintBoxElement.nativeElement.innerHTML += `<div class="paragraph-text">${hint}</div>`;
    }
  }

  async getLevelFiles(): Promise<void> {
    const requestURL = new URL("files/3", environment.backendUrl).href;

    const axiosOptions: AxiosRequestConfig = {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
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

  private calculateScore(level: Level): number[] {
    const hints: number[] = [];
    level.usedHints.forEach(() => {
      this.usedHints.push(1);
      this.hints.pop();
    })
    return hints;
  }

  goToNextLevel(): void {
    this.levelService.changeSelectedLevel(4);
    this.router.navigate(['/level4']);
  }
}
