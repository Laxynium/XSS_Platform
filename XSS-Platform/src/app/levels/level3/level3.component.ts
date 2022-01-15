import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {LevelService} from "../../level.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import axios, {AxiosRequestConfig} from "axios";
import {saveAs} from "file-saver";
import {environment} from "../../../environments/environment";
import { Hint, UserService } from 'src/app/user.service';

@Component({
  selector: 'app-level3',
  templateUrl: './level3.component.html',
  styleUrls: ['./level3.component.scss']
})
export class Level3Component implements OnInit {
  completed: boolean = false;  
  token: string = "";

  usedHints: Hint[] = []
  totalHints: number = 0;
  @ViewChild('hintBox') hintBoxElement!: ElementRef;
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;

  constructor(
    public levelService: LevelService,    
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
        this.usedHints = level.usedHints;
        this.totalHints  = level.totalHints
      }
    });

    window.addEventListener(
      'message',
      (event) => {
        if (event.data === 'success') {
          this.levelService.updateLevel(1, true, this.totalHints);
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
    this.userService.useHint(3, this.token, this.usedHints.length + 1).subscribe(user =>{
      this.usedHints = user.levels[2].usedHints
    })
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

  goToNextLevel(): void {
    this.levelService.changeSelectedLevel(4);
    this.router.navigate(['/level4']);
  }
}
