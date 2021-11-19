import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';

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
  constructor(private zone: NgZone) {
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
  }
}
