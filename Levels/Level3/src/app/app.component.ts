import {Component, ElementRef, HostListener, NgZone, ViewChild} from '@angular/core';
import {XssVerification} from "./xss-verification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  completed: boolean = false;
  allMessages: string[] = [];

  providedString: string = '';
  @ViewChild('input') inputElement!: ElementRef;
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
        .verify(this.providedString, this.currentLevelToken)
        .subscribe((response) => {
          console.log(`Token: ${response.validationResult}`);
          console.dir(`User messages: ${response.messages}}`);
          if (!response.validationResult) {
            return;
          }
          this.allMessages = response.messages;
          this.token = response.validationResult;
          originalAlert('Success');
          this.zone.run(() => {
            parent.postMessage('success', '*');
            this.completed = true;
          });
        });
    };
  }

  sendToServer(): void {
    this.providedString = this.inputElement.nativeElement.value;
  }
}

type Event = {
  type: string;
  level: { number: number; token: string };
};
