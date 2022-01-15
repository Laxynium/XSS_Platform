import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import axios, { AxiosRequestConfig } from 'axios';
import * as saveAs from 'file-saver';
import { combineLatest, Subject } from 'rxjs';
import { LevelService } from 'src/app/level.service';
import { Hint, UserService } from 'src/app/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-level4',
  templateUrl: './level4.component.html',
  styleUrls: ['./level4.component.scss']
})
export class Level4Component implements OnInit {
  public frameUrl: SafeResourceUrl;
  public frameUrlStr: string;

  private frameReloaded$: Subject<{}> = new Subject();

  completed: boolean = false
  token: string = "";

  usedHints: Hint[] = []
  totalHints: number = 0

  @ViewChild('hintBox') hintBoxElement!: ElementRef;
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;

  constructor(private sanitizer: DomSanitizer,
    public levelService: LevelService,
    private userService: UserService,    
    private router: Router,
    private store: Store<{ score: number }>,) {
    this.frameUrlStr = 'http://localhost:3004';
    this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.frameUrlStr);

    this.userService.user$.subscribe(user => {
      const level = user?.levels.find(level => level.number === 4);
      if(level) {
        this.completed = level.completed;
        this.token = level.token;
        this.usedHints = level.usedHints;
        this.totalHints  = level.totalHints
      }
    });

    window.addEventListener(
      'message',
      (event) => {
        if (event.data === 'success') {          
          this.levelService.updateLevel(4, true, this.totalHints);
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
        const level = user.levels.find((l) => l.number == 4);
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
    this.userService.useHint(4, this.token, this.usedHints.length + 1).subscribe(user =>{
      this.usedHints = user.levels[3].usedHints
    })
  }

  async getLevelFiles(): Promise<void> {
    const requestURL = new URL("files/4", environment.backendUrl).href;

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
        const filename = 'level4.zip';
        saveAs(blob, filename);
      })
      .catch((e) => {
      });
  }

  goToNextLevel(): void {
    this.levelService.changeSelectedLevel(4);
    this.router.navigate(['/level4']);
  }
}
