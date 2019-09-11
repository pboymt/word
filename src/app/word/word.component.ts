import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { WordService, Word } from '../services/word.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit, OnChanges {

  @ViewChild('origin', { static: true })
  origin: ElementRef<HTMLDivElement>;

  @ViewChild('container', { static: true })
  container: ElementRef<HTMLDivElement>;

  isHandset = false;

  scale = 1;
  current: Word;
  part = 0;

  constructor(
    breakpointObserver: BreakpointObserver,
    public wordService: WordService
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
    console.log(window.innerHeight, window.innerWidth);
    this.wordService.$word.subscribe((word: Word) => {
      this.current = word;
      this.part = 0;
      this.scale = 1;
      setTimeout(() => {
        const wScale = this.origin.nativeElement.offsetWidth / this.container.nativeElement.offsetWidth;
        const hScale = this.origin.nativeElement.offsetHeight / this.container.nativeElement.offsetHeight;
        this.scale = Math.min(wScale, hScale) * 0.95;
      });
    });
    this.wordService.getCurrent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  prev(ev: Event) {
    this.wordService.getPrev();
  }

  next(ev: Event) {
    this.wordService.getNext();
  }

  changePart() {
    let nextPart = this.part + 1;
    if (nextPart > this.current.symbols[0].parts.length - 1) {
      nextPart = 0;
    }
    this.part = nextPart;
  }

}
