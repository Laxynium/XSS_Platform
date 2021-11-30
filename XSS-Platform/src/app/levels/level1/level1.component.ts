import { HintsService } from './../../hints.service';
import {LevelService} from './../../level.service';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {saveAs} from 'file-saver';
import axios, {AxiosRequestConfig} from 'axios';
import {Level, UserService} from 'src/app/user.service';
import {environment} from 'src/environments/environment'

@Component({
  selector: 'app-level1',
  templateUrl: './level1.component.html',
  styleUrls: ['./level1.component.scss'],
})
export class Level1Component implements OnInit {
  // Example solution
  // <img src=X onerror="alert()">
  completed: boolean = false;
  usedHints: number[] = [];
  token: string = "";
  hints: string[] = [
    'Sprobuj uzyć taga img.',
    "Waznym elementem jest 'onerror' event.",
    "Podaj funkcje alert() wewnatrz 'onerror' i 'src', który nie istnieje.",
  ];

  @ViewChild('hintBox') hintBoxElement!: ElementRef;
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;

  constructor(
    public levelService: LevelService,
    public hintsService: HintsService,
    private router: Router,
    private store: Store<{ score: number }>,
    private userService: UserService
  ) {
    this.userService.user$.subscribe(user => {
      const level = user?.levels.find(level => level.number === 1);
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
        const level = user.levels.find((l) => l.number == 1);
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
    this.completed = this.levelService.isLevelCompleted(1);
  }

  showHint(): void {
    const hint = this.hints.shift();
    if (hint) {
      this.usedHints.push(1);
      this.hintsService.useHint(1, this.token, this.usedHints.length);
      this.hintBoxElement.nativeElement.innerHTML += `<div class="paragraph-text">${hint}</div>`;
    }
  }

  async getLevelFiles(): Promise<void> {
    const requestURL = new URL("files/1", environment.backendUrl).href;

    const axiosOptions: AxiosRequestConfig = {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    };

    axios
      .get(requestURL, axiosOptions)
      .then((response) => {
        const blob = new Blob([response.data], {
          type: 'application/octet-stream',
        });
        const filename = 'download.zip';
        saveAs(blob, filename);
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
    this.levelService.changeSelectedLevel(2);
    this.router.navigate(['/level2']);
  }
}
