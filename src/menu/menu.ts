import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { Data } from 'src/providers/data';

@Component({
  selector: 'menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})

export class MenuComponent {

  constructor(
    public data: Data,
    public router: Router,
    private storage: Storage
  ) {}

  async selectChart(chart) {
    if (!chart.hasData) {
      return;
    }
    this.data.selectedChartName = chart.title;
    if (!this.data.selectedFrequency) this.data.selectedFrequency = 'weekly';
    if (!this.data.selectedFilter || !this.chartHasSelectedFilter()) this.data.selectedFilter = 'sats';
    this.data.selectedChart = this.data[chart.dataName][this.data.selectedFrequency || 'weekly'][this.data.selectedFilter || 'count'];
    this.data.menuItems.map((chart) => chart.isSelected = false);
    chart.isSelected = true;
    this.router.navigate(['']);
  }

  chartHasSelectedFilter() {
    let hasFilter = false;
    this.data.filterMenuItems[this.data.selectedChartName].map((item) => {
      if (item.filter == this.data.selectedFilter) {
        hasFilter = true;
      }
    });
    return hasFilter;
  }

  async selectFrequency(frequency) {
    if (!this.data.hasData) {
      return;
    }
    this.data.selectedFrequency = frequency;
    if (!this.hasChartSelected()) this.data.selectDefaultChartInMenu(false, true);
    const selectedChart = this.getSelectedChart(this.data.selectedChartName);
    this.data.selectedChart = selectedChart[frequency][this.data.selectedFilter || 'count'];
    this.router.navigate(['']);
  }

  async selectFilter(filter) {
    if (!this.data.hasData) {
      return;
    }
    this.data.selectedFilter = filter;
    if (!this.hasChartSelected()) this.data.selectDefaultChartInMenu(true, false);
    const selectedChart = this.getSelectedChart(this.data.selectedChartName);
    this.data.selectedChart = selectedChart[this.data.selectedFrequency || 'weekly'][filter];
    this.router.navigate(['']);
  }

  hasChartSelected() {
    let hasChartSelected = false;
    this.data.menuItems.map((item) => {
      if (item.isSelected) {
        hasChartSelected = true;
      }
    });
    return hasChartSelected;
  }

  getSelectedChart(title) {
    const types = {
      'Forwards': this.data.forwards,
      'Chain Fees': this.data.chainFees,
      'Rebalance Fees': this.data.rebalanceFees,
      'Payments': this.data.payments,
      'Lightning Fees': this.data.lightningFees,
      'Keysends': this.data.keysends,
      'Profit': this.data.profit
    }
    return types[title];
  }

  goToAddDataPage() {
    this.data.menuItems.map((item) => item.isSelected = false);
    this.data.selectedFrequency = '';
    this.data.selectedFilter = '';
    this.router.navigate(['add-data']);
  }

  goToColdSatsPage() {
    this.data.menuItems.map((item) => item.isSelected = false);
    this.data.selectedFrequency = '';
    this.data.selectedFilter = '';
    this.router.navigate(['cold-sats']);
  }

}
