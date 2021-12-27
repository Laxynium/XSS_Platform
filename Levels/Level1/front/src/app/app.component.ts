import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  ViewChild,
} from '@angular/core';
import { XssVerification } from './xss-verification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  completed: boolean = false;
  providedString: string = '';
  @ViewChild('input') inputElement!: ElementRef;
  token: string = '';
  url: string = 'https://www.xss-platform.com/Level1';

  currentLevelToken: string = '';
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent<Event>) {
    if (event.data.type === 'level') {
      const { number, token } = event.data.level;
      if (number == 1) {
        this.currentLevelToken = token;
      }
    }
  }

  // Example solution
  // <img src=X onerror="alert()">
  constructor(private zone: NgZone, private xssVerification: XssVerification) {
    const originalAlert = alert;
    window.alert = () => {
      this.xssVerification
        .verify(this.providedString, this.currentLevelToken)
        .subscribe((nextLevelToken) => {
          console.log(`Token: ${nextLevelToken.validationResult}`);
          if (!nextLevelToken.validationResult) {
            return;
          }
          this.token = nextLevelToken.validationResult;
          originalAlert('Success');
          this.zone.run(() => {
            parent.postMessage('success', '*');
            this.completed = true;
          });
        });
    };
  }

  verify(): void {
    this.providedString = this.inputElement.nativeElement.value;
  }
}

type Event = {
  type: string;
  level: { number: number; token: string };
};
