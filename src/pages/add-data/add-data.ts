import { Component, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

import { Data } from 'src/providers/data';
import { CSVParser } from 'src/providers/csv-parser';

@Component({
  selector: 'add-data',
  templateUrl: './add-data.html',
  styleUrls: ['./add-data.scss']
})

export class AddDataPage {

  isConfirmingClearData: boolean;
  showInvalidDataError: boolean;
  showSuccessAlert: boolean;
  showWiggleAnimation = {
    forwards: false,
    chainFees: false,
    payments: false,
    invoices: false
  };

  constructor(
    public data: Data,
    private parser: CSVParser,
    private router: Router,
    private storage: Storage
  ) {}

  async saveData() {
    this.showInvalidDataError = false;
    this.showSuccessAlert = false;
    try {
      const data = (<HTMLInputElement>document.getElementById('bosTextArea')).value;
      await this.data.parseDataForChart(data);
      (<HTMLInputElement>document.getElementById('bosTextArea')).value = '';
      this.selectMenuItems();
      this.showWiggleAnimation[this.data.lastAddedChartType] = true;
      this.showSuccessAlert = true;
      setTimeout(() => {
        this.showWiggleAnimation[this.data.lastAddedChartType] = false;
        this.showSuccessAlert = false;
      }, 1500);
      } catch(err) {
      this.showInvalidDataError = true;
      setTimeout(() => this.showInvalidDataError = false, 3000)
    }
  }

  selectMenuItems() {
    this.data.menuItems.map((item) => {
      if (this.data[item.dataName]?.daily) {
        this.data.hasData = true;
        item.hasData = true;
      }
    });
    if (this.data.forwards) {
      this.data.profit = this.parser.parseProfit(this.data.forwards, this.data.keysends, this.data.chainFees, this.data.rebalanceFees, this.data.lightningFees, this.data.payments);
      this.data.menuItems.map((item) => {
        if (item.title == 'Profit') {
          item.hasData = true;
        }
      });
    }
  }

  confirmClearData() {
    this.showWiggleAnimation = {
      forwards: true,
      chainFees: true,
      payments: true,
      invoices: true
    }
    setTimeout(() => this.showWiggleAnimation = {
      forwards: false,
      chainFees: false,
      payments: false,
      invoices: false
    }, 1500)
    this.data.clearData();
    this.isConfirmingClearData = false;
  }

  exportTxt(fileName, data) {
    var link = document.createElement('a');
    link.download = `${fileName}.txt`;
    var blob = new Blob([data], {type: 'text/plain'});
    link.href = window.URL.createObjectURL(blob);
    link.click();
  }

  goToPaymentsExcludeListPage() {
    this.router.navigate(['payments-exclude-list']);
  }

  goToKeysendsExcludeListPage() {
    this.router.navigate(['keysends-exclude-list']);
  }

}
