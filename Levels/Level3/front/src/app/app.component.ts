import {Component, ElementRef, HostListener, NgZone, ViewChild} from '@angular/core';
import {XssVerification} from "./xss-verification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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
        .subscribe((response) => {
          console.log(`Token: ${response.validationResult}`);
          console.dir(`User messages: ${response.messages}}`);
          if (!response.validationResult) {            
            return;
          }
          originalAlert('Success');
          // this.zone.run(() => {
          //   parent.postMessage('success', '*');
          //   this.completed = true;
          // });
        });
    };
  }
}

type Event = {
  type: string;
  level: { number: number; token: string };
};
