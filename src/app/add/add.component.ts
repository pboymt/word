import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { WordService } from '../services/word.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  form = new FormGroup({
    word: new FormControl('', [Validators.required, Validators.pattern(/^[A-z]+$/)])
  });

  uploading = false;
  result = '';

  constructor(
    private word: WordService
  ) { }

  ngOnInit() {
  }

  async submitWord() {
    this.uploading = true;
    const w = this.form.get('word').value;
    this.result = await this.word.add(w);
    this.form.reset();
    this.uploading = false;
  }

}
