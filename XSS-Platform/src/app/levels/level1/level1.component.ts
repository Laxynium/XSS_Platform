import { LevelService } from './../../level.service';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/score.actions';
import axios from 'axios';

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
    // const result = await new Octokit().request('GET /repos/{owner}/{repo}/zipball/{ref}', {
    //   owner: 'Laxynium',
    //   repo: 'XSS_Platform',
    //   ref: 'master',
    // });
    // console.log(result)

    const githubURL = 'https://student.agh.edu.pl/~kunc/Soa-egzamin.pdf'
    fetch(githubURL, {
      mode: 'no-cors',
      method: 'GET',
      headers: { 'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Methods": "GET, POST, PUT",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization" }
    })
    .then((response) => {
          console.log(response);
            // const url = window.URL
            //       .createObjectURL(new Blob([response.data]));
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', 'image.jpg');
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
      })
  }

  goToNextLevel(): void {
    this.levelService.changeSelectedLevel(2);
    this.router.navigate(['/level2']);
  }
}
