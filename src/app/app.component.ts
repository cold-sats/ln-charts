import { Component, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Data } from 'src/providers/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  loaded: boolean;

  constructor(
    public data: Data,
    private router: Router
  ) {}

  async ngOnInit() {
    this.loaded = false;
    try {
      await this.data.loadData();
      if (this.router.url == '/') {
        const path = this.data.hasData ? [''] : ['add-data'];
        this.router.navigate(path);
      }
      console.log(this.data);
    } catch(err) {
      console.log(err)
    }
    this.loaded = true;
  }

}
