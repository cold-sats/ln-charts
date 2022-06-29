import { Component, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';

import { Data } from 'src/providers/data';

@Component({
  selector: 'cold-sats',
  templateUrl: './cold-sats.html',
  styleUrls: ['./cold-sats.scss']
})

export class ColdSatsPage {

  showCopied: boolean;

  constructor(
    public data: Data,
    public storage: Storage
  ) {}

  addToKeysendsExcludeList() {
    const data = (<HTMLInputElement>document.getElementById('keysendsExcludeTextArea')).value;
    this.data.keysendsExcludeList.push(data);
    this.storage.set('keysendsExcludeList', this.data.keysendsExcludeList);
  }

  removeFromKeysendsExcludeList(item) {
    const index = this.data.keysendsExcludeList.indexOf(item);
    this.data.keysendsExcludeList.splice(index, 1);
    this.storage.set('keysendsExcludeList', this.data.keysendsExcludeList);
  }

  copyKeysendCommand() {
    const command = 'bos send 020a3dce2dab038955eb435a8342e4fe897304015314485d3738d5f41eccb47859 --amount 1000 --message "Thanks for ln-charts!"';
    this.copyToClipBoard(command);
    this.showCopied = true;
    setTimeout(() => this.showCopied = false, 2000);
  }

  copyToClipBoard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
  
}
