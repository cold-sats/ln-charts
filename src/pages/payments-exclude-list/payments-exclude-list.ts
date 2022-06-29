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

  addToPaymentsExcludeList() {
    const data = (<HTMLInputElement>document.getElementById('paymentsExcludeTextArea')).value;
    this.data.paymentsExcludeList.push(data);
    this.storage.set('paymentsExcludeList', this.data.paymentsExcludeList);
    (<HTMLInputElement>document.getElementById('paymentsExcludeTextArea')).value = '';
  }

  removeFromPaymentsExcludeList(item) {
    const index = this.data.paymentsExcludeList.indexOf(item);
    this.data.paymentsExcludeList.splice(index, 1);
    this.storage.set('paymentsExcludeList', this.data.paymentsExcludeList);
  }

}
