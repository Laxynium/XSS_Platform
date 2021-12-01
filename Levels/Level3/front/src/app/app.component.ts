import {Component, ElementRef, HostListener, NgZone, ViewChild} from '@angular/core';
import {XssVerification} from "./xss-verification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  token: string = '';
  currentLevelToken: string = '';
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent<Event>) {
    if (event.data.type === 'level') {
      const { number, token } = event.data.level;
      if (number == 3) {
        this.currentLevelToken = token;
      }
    }
  }

  constructor(private zone: NgZone, private xssVerifier: XssVerification) {
    const originalAlert = alert;
    window.alert = () => {
      this.xssVerifier
        .verify("", this.currentLevelToken)
        .subscribe((nextLevelToken) => {
          console.log(`Token: ${nextLevelToken.validationResult}`);
          if (!nextLevelToken.validationResult) {
            return;
          }
          this.token = nextLevelToken.validationResult;
          originalAlert('Success');
          this.zone.run(() => {
            parent.postMessage('success', '*');
          });
        });
    };;
  }
}

type Event = {
  type: string;
  level: { number: number; token: string };
};
