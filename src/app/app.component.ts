import { Component, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Data } from 'src/providers/data';

declare let gtag: Function;

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
      this.setUpAnalytics();
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

  setUpAnalytics() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
            gtag('config', 'G-20MYM71Z9F',
                {
                    page_path: event.urlAfterRedirects
                }
            );
        });
  }

}
