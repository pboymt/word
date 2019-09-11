import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface Word {
  word_name: string,
  is_CRI: 1,
  exchange: {
    word_pl: string[],
    word_past: string[],
    word_done: string[],
    word_ing: string[],
    word_third: string[],
    word_er: string,
    word_est: string
  },
  symbols: {
    ph_en: string,
    ph_am: string,
    ph_other: string,
    ph_en_mp3: string,
    ph_am_mp3: string,
    ph_tts_mp3: string,
    parts: {
      part: string,
      means: string[]
    }[]
  }[];
  items: string[];
}

interface ResponseWord {

  code: number;
  message: string;
  data?: Word;

}

@Injectable({
  providedIn: 'root'
})
export class WordService {

  wordSubject = new Subject<Word>();
  $word = this.wordSubject.asObservable();

  defaultWord: Word = { "word_name": "go", "is_CRI": 1, "exchange": { "word_pl": ["goes"], "word_past": ["went"], "word_done": ["gone"], "word_ing": ["going"], "word_third": ["goes"], "word_er": "", "word_est": "" }, "symbols": [{ "ph_en": "gəʊ", "ph_am": "goʊ", "ph_other": "", "ph_en_mp3": "http://res.iciba.com/resource/amp3/0/0/34/d1/34d1f91fb2e514b8576fab1a75a89a6b.mp3", "ph_am_mp3": "http://res.iciba.com/resource/amp3/1/0/34/d1/34d1f91fb2e514b8576fab1a75a89a6b.mp3", "ph_tts_mp3": "http://res-tts.iciba.com/3/4/d/34d1f91fb2e514b8576fab1a75a89a6b.mp3", "parts": [{ "part": "vi.", "means": ["走", "离开", "去做", "进行"] }, { "part": "vt.", "means": ["变得", "发出…声音", "成为", "处于…状态"] }, { "part": "n.", "means": ["轮到的顺序", "精力", "干劲", "尝试"] }] }], "items": [""] };

  current = localStorage.getItem('last') ? JSON.parse(localStorage.getItem('last')) : this.defaultWord;

  private history: string[] = [];

  constructor(
    private http: HttpClient
  ) {
    this.history = JSON.parse(localStorage.getItem('word-history') || '[]');
  }

  get key(): string | false {
    const key = localStorage.getItem('key');
    if (key) {
      return key;
    } else {
      return false;
    }
  }

  get level(): number {
    const level = localStorage.getItem('level');
    if (typeof level === 'number') {
      return level;
    } else {
      return Number(level) || 0;
    }
  }

  addHistory(word: string) {
    const index = this.history.indexOf(word);
    if (index > -1) {
      this.history.splice(index, 1);
    }
    this.history.push(word);
    localStorage.setItem('word-history', JSON.stringify(this.history));
  }

  getLast(before: string) {
    const index = this.history.indexOf(before);
    if (index < 1) {
      return false;
    } else {
      return this.history[index - 1];
    }
  }

  async getCurrent() {
    this.wordSubject.next(this.current);
  }

  async getNext() {
    if (this.key) {
      const params = new HttpParams()
        .set('key', this.key)
        .set('level', this.level.toString());
      try {
        const word = await this.http.get<ResponseWord>('/api/word', { params }).toPromise();
        if (word.code === 0 && word.data) {
          this.current = word.data;
          this.addHistory(word.data.word_name);
          localStorage.setItem('last', JSON.stringify(word.data));
          this.wordSubject.next(this.current);
        }
      } catch (error) {

      }
    } else {
      this.current = this.defaultWord;
      this.wordSubject.next(this.current);
    }
  }

  async getPrev() {
    if (this.key) {
      const last = this.getLast(this.current.word_name);
      console.log(last);
      if (last) {
        const params = new HttpParams()
          .set('key', this.key);
        try {
          const word = await this.http.get<ResponseWord>(`/api/w/${last}`, { params }).toPromise();
          if (word.code === 0 && word.data) {
            this.current = word.data;
            this.wordSubject.next(this.current);
          }
        } catch (error) {

        }
      }
    } else {
      this.current = this.defaultWord;
      this.wordSubject.next(this.current);
    }
  }

  async add(word: string) {
    word = word.trim();
    if (!this.key) return '你的Key呢？';
    if (/^[A-z]+$/.test(word)) {
      const params = new HttpParams()
        .set('key', this.key);
      try {
        const res = await this.http.post<ResponseWord>('/api/word', { word }, { params }).toPromise();
        if (res.code === 0) {
          return '成功';
        } else {
          throw res.message;
        }
      } catch (error) {
        return `失败：${error}`;
      }
    } else {
      return '你提交的什么玩意儿？';
    }
  }

}
