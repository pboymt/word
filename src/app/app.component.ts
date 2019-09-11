import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'word';

  isHandset = false;

  get dark() {
    return this.theme.currentTheme === 'dark';
  }

  constructor(
    breakpointObserver: BreakpointObserver,
    private theme: ThemeService
  ) {
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.isHandset = true;
        // this.activateHandsetLayout();
      }
    });
    breakpointObserver.observe([
      Breakpoints.Web,
    ]).subscribe(result => {
      if (result.matches) {
        this.isHandset = false;
        // this.activateWebLayout();
      }
    });
  }

  ngOnInit() {
    window.addEventListener('keypress', (ev) => {
      console.log(ev.key);
    });
  }

  fs() {
    console.log('fs');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  }

}
