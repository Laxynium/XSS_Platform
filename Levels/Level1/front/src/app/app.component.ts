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

  // Example solution
  // <img src=X onerror="alert()">
  constructor(private zone: NgZone, private xssVerification: XssVerification) {
    const originalAlert = alert;
    window.alert = () => {
      originalAlert('Success!');
      this.zone.run(() => {
        parent.postMessage('success', '*');
        this.completed = true;
      });
    };
  }

  verify(): void {
    this.providedString = this.inputElement.nativeElement.value;
    // this.xssVerification
    //   .verify(this.providedString)
    //   .subscribe((token) =>
    //     console.log(
    //       `Your answer got verified. Here is your token to next level: '${token}'`
    //     )
    //   );
  }
}
