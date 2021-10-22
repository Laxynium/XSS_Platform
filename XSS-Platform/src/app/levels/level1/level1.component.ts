import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-level1',
  templateUrl: './level1.component.html',
  styleUrls: ['./level1.component.scss']
})
export class Level1Component implements OnInit {
  @Input() providedString: string = '';
  constructor() { }

  ngOnInit(): void {
  }

  verify(): void {
    document.getElementsByClassName('testDiv')[0].innerHTML = this.providedString;
  }
}
