import { Component, Input, OnInit } from '@angular/core';
import { LevelService } from './level.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'XSS-Platform';

  @Input() selectedLevel: number = 1;
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.userService.getLoadUser().subscribe();
  }
}
