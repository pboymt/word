import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ThemeService } from '../services/theme.service';
import { WordService } from '../services/word.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  configs = new FormGroup({
    authKey: new FormControl('', [Validators.required, Validators.minLength(8)]),
    level: new FormControl(0, [Validators.required, Validators.min(0)]),
    theme: new FormControl('default')
  });

  constructor(
    public theme: ThemeService,
    public word: WordService
  ) { }

  ngOnInit() {
    this.configs.setValue({
      'authKey': this.word.key || '',
      level: this.word.level,
      theme: this.theme.currentTheme
    });
  }

  saveConfig() {
    localStorage.setItem('key', this.configs.controls['authKey'].value);
    localStorage.setItem('level', this.configs.controls['level'].value);
    localStorage.setItem('theme', this.configs.controls['theme'].value);
  }

  changeLevel(num: number) {
    const level = this.configs.controls['level'];
    if (level.value + num >= 0) level.setValue(level.value + num);
  }

}
