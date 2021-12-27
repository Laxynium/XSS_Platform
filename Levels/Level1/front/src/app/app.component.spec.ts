import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SafePipe } from './safe-pipe.pipe';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        SafePipe
      ],
      providers: [SafePipe],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have correct url`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.url).toEqual('https://www.xss-platform.com/Level1');
  });

  it(`should show "Success" text`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.completed = true;
    fixture.autoDetectChanges();
    expect(document.querySelector('.header-text')?.innerHTML).toEqual('Success!!!');
  });

  it(`should check input value`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.providedString = 'random string';
    fixture.autoDetectChanges();
    expect(document.querySelector('.testDiv')?.innerHTML).toEqual('random string');
  });

  it('should check logo text', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    expect(document.querySelector('.logo-container')?.innerHTML).toEqual('Google');
  });

  it('should check logo text', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.autoDetectChanges();
    app.inputElement.nativeElement.value = "new value";
    app.verify();
    expect(app.providedString).toEqual('new value');
  });
});
