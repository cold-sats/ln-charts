import { Component, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';

import { Data } from 'src/providers/data';

@Component({
  selector: 'keysends-exclude-list',
  templateUrl: './keysends-exclude-list.html',
  styleUrls: ['./keysends-exclude-list.scss']
})

export class KeysendsExcludeListPage {

  constructor(
    public data: Data,
    public storage: Storage
  ) {}

  addToKeysendsExcludeList() {
    const data = (<HTMLInputElement>document.getElementById('keysendsExcludeTextArea')).value;
    this.data.keysendsExcludeList.push(data);
    this.storage.set('keysendsExcludeList', this.data.keysendsExcludeList);
    (<HTMLInputElement>document.getElementById('keysendsExcludeTextArea')).value = '';
  }

  removeFromKeysendsExcludeList(item) {
    const index = this.data.keysendsExcludeList.indexOf(item);
    this.data.keysendsExcludeList.splice(index, 1);
    this.storage.set('keysendsExcludeList', this.data.keysendsExcludeList);
  }

}
