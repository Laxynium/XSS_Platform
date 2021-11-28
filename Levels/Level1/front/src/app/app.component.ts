import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
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

  // Example solution
  // <img src=X onerror="alert()">
  constructor(private zone: NgZone, private xssVerification: XssVerification) {
    const originalAlert = alert;
    window.alert = () => {
      this.xssVerification
      .verify(this.providedString)
      .subscribe((token) => {
          this.token = token.validationResult;
          console.log(`Token: ${token.validationResult}`);
          originalAlert("Success");
          this.zone.run(() => {
            parent.postMessage('success', '*');
            this.completed = true;
          });
      });
    }
  }

  verify(): void {
    this.providedString = this.inputElement.nativeElement.value;
  }
}
