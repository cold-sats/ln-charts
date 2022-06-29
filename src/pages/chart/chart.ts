import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { Data } from 'src/providers/data';

@Component({
  selector: 'chart',
  templateUrl: './chart.html',
  styleUrls: ['./chart.scss']
})

export class ChartPage {

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(
    public data: Data,
  ) {}

  getContainerHeight() {
    return window.innerHeight - 80;
  }

  getContainerWidth() {
    return window.innerWidth - 166;
  }

}
