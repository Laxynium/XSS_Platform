import { SERVER_URL } from './../../constants';
import { LevelService } from './../../level.service';
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/score.actions';
import { saveAs } from 'file-saver';
import axios, { AxiosRequestConfig } from 'axios';
import { UserService } from 'src/app/user.service';

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
  hints: string[] = [
    'Sprobuj uzyć taga <img>.',
    "Waznym elementem jest 'onerror' event.",
    "Podaj funkcje alert() wewnatrz 'onerror' i 'src', który nie istnieje.",
  ];

  @ViewChild('hintBox') hintBoxElement!: ElementRef;
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;

  constructor(
    public levelService: LevelService,
    private router: Router,
    private store: Store<{ score: number }>,
    private userService: UserService
  ) {
    this.userService.user$.subscribe(user => {
      this.completed = user?.levels.find(level => level.number === 1)?.completed ?? false;
    })

    window.addEventListener(
      'message',
      (event) => {
        if (event.data === 'success') {
          this.store.dispatch(increment({ byScore: this.hints.length }));
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
          () =>
            this.iframe.nativeElement.contentWindow?.postMessage(
              {
                type: 'level',
                level: level,
              },
              '*'
            ),
          1000
        );
      }
    });
  }

  ngOnInit(): void {
    this.completed = this.levelService.isLevelCompleted(1);
  }

  showHint(): void {
    this.usedHints.push(1);
    const hint = this.hints.shift();
    if (hint)
      this.hintBoxElement.nativeElement.innerHTML += `<div class="paragraph-text">${hint}</div>`;
  }

  async getLevelFiles(): Promise<void> {
    const requestURL = SERVER_URL + '/files/1';

    const axiosOptions: AxiosRequestConfig = {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
      }
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
      .catch((e) => {});
  }

  goToNextLevel(): void {
    this.levelService.changeSelectedLevel(2);
    this.router.navigate(['/level2']);
  }
}
