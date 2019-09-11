import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  availableTheme = ['default', 'dark'];

  selectedTheme = new Subject<string>();
  $selectedTheme = this.selectedTheme.asObservable();

  get currentTheme() {
    const theme = localStorage.getItem('theme');
    return this.availableTheme.includes(theme) ? theme : 'default'
  }

  constructor() {
    const theme = localStorage.getItem('theme');
    this.selectedTheme.next(this.availableTheme.includes(theme) ? theme : 'default');
  }

  chooseTheme(themeName: string) {
    if (this.availableTheme.includes(themeName)) {
      localStorage.setItem('theme', themeName);
      this.selectedTheme.next(themeName);
    }
  }
}
