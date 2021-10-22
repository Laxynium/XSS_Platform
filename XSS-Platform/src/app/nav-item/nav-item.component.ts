import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent implements OnInit {

  @Input() levelNumber: number = 0;
  @Input() selected: boolean = false;
  @Input() completed: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
}
