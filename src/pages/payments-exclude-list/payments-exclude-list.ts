import { Component, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';

import { Data } from 'src/providers/data';

@Component({
  selector: 'payments-exclude-list',
  templateUrl: './payments-exclude-list.html',
  styleUrls: ['./payments-exclude-list.scss']
})

export class PaymentsExcludeListPage {

  constructor(
    public data: Data,
    public storage: Storage
  ) {}

  async addToPaymentsExcludeList() {
    const data = (<HTMLInputElement>document.getElementById('paymentsExcludeTextArea')).value;
    const formattedData = '\"' + data + '\"';
    this.data.paymentsExcludeList.push(formattedData);
    await this.storage.set('paymentsExcludeList', this.data.paymentsExcludeList);
    (<HTMLInputElement>document.getElementById('paymentsExcludeTextArea')).value = '';
    this.data.loadData();
  }

  async removeFromPaymentsExcludeList(item) {
    const index = this.data.paymentsExcludeList.indexOf(item);
    this.data.paymentsExcludeList.splice(index, 1);
    await this.storage.set('paymentsExcludeList', this.data.paymentsExcludeList);
    this.data.loadData();
  }

}
