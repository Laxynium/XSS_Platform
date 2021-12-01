import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import axios, { AxiosRequestConfig } from 'axios';
import * as saveAs from 'file-saver';
import { combineLatest, Subject } from 'rxjs';
import { HintsService } from 'src/app/hints.service';
import { LevelService } from 'src/app/level.service';
import { increment } from 'src/app/score.actions';
import { Level, UserService } from 'src/app/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-level2',
  templateUrl: './level2.component.html',
  styleUrls: ['./level2.component.scss']
})
export class Level2Component implements OnInit {
  public frameUrl: SafeResourceUrl;
  public frameUrlStr: string;

  private frameReloaded$: Subject<{}> = new Subject();

  completed: boolean = false
  usedHints: number[] = [];
  token: string = "";
  hints: string[] = [
    'Sprobuj uzyć taga <img>.',
    "Waznym elementem jest 'onerror' event.",
    "Podaj funkcje alert() wewnatrz 'onerror' i 'src', który nie istnieje.",
  ];

  @ViewChild('hintBox') hintBoxElement!: ElementRef;
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;

  constructor(private sanitizer: DomSanitizer,
    public levelService: LevelService,
    private userService: UserService,
    public hintsService: HintsService,
    private router: Router,
    private store: Store<{ score: number }>,) {
    this.frameUrlStr = 'http://localhost:3002';
    this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.frameUrlStr);

    this.userService.user$.subscribe(user => {
      const level = user?.levels.find(level => level.number === 2);
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
          this.store.dispatch(increment({byScore: this.hints.length}));
          this.levelService.updateLevel(2, true, this.hints.length);
          this.userService.getLoadUser().subscribe();
          this.completed = true;
          return;
        }
      },
      false
    );

    combineLatest([this.userService.user$, this.frameReloaded$])
      .subscribe(([user,_])=>{
        if(!user){
          return;
        }
        const level = user.levels.find((l) => l.number == 2);
        if (!level) {
          return;
        }
        setTimeout(()=>{
          if(!this.iframe){
            return;
          }
          this.iframe.nativeElement.contentWindow?.postMessage({
              type: 'level',
              level: level,
            },
            '*'
          );
        }, 500);
      })
   }

  ngOnInit(): void {
  }

  updateUrl(url: any){
    console.log(url);
  }

  reload(){
    console.log("Reloading iframe")
    console.log(this.frameUrlStr);
    this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.frameUrlStr);
  }

  frameLoaded(){
    this.frameReloaded$.next({});
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
    const requestURL = new URL("files/2", environment.backendUrl).href;

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
    this.levelService.changeSelectedLevel(3);
    this.router.navigate(['/level3']);
  }
}
