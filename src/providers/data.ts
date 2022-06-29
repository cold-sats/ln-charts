import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { CSVParser } from 'src/providers/csv-parser';

import { menuItems, filterMenuItems } from 'src/menu/menu-items';

import { chainFees } from 'src/bos-data/chain-fees';
import { forwards } from 'src/bos-data/forwards';
import { invoices } from 'src/bos-data/invoices';
import { payments } from 'src/bos-data/payments';

interface chartModel {
  name: string;
  value: number;
}

@Injectable()
export class Data {

  loaded: boolean;
  lastAddedChartType: string;
  hasData: boolean;

  //Exclude lists (saved in storage)
  paymentsExcludeList = [];
  keysendsExcludeList = [];

  //Raw bos csv data (saved in storage)
  rawForwards: string;
  rawPayments: string;
  rawChainFees: string;
  rawInvoices: string;

  //Raw bos csv data (saved in project files)
  rawForwardsFile = forwards;
  rawPaymentsFile = payments;
  rawChainFeesFile = chainFees;
  rawInvoicesFile = invoices;

  //Length of raw bos data
  rawForwardsLength = 0;
  rawPaymentsLength = 0;
  rawChainFeesLength = 0;
  rawInvoicesLength = 0;

  //Formatted arrays for ngx charts
  profit: {
    daily: chartModel[];
    weekly: chartModel[];
    monthly: chartModel[];
  };
  chainFees: {
    daily: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
    weekly: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
    monthly: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
  };
  forwards: {
    daily: {
      amountRouted: chartModel[];
      average: chartModel[];
      avgPPM: chartModel[];
      count: chartModel[];
      routeSize: chartModel[];
      sats: chartModel[];
    };
    weekly: {
      amountRouted: chartModel[];
      average: chartModel[];
      avgPPM: chartModel[];
      count: chartModel[];
      routeSize: chartModel[];
      sats: chartModel[];
    };
    monthly: {
      amountRouted: chartModel[];
      average: chartModel[];
      avgPPM: chartModel[];
      count: chartModel[];
      routeSize: chartModel[];
      sats: chartModel[];
    };
  };
  rebalanceFees: {
    daily: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
    weekly: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
    monthly: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
  };
  payments: {
    daily: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
    weekly: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
    monthly: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
  };
  lightningFees: {
    daily: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
    weekly: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
    monthly: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
  };
  keysends: {
    daily: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
    weekly: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
    monthly: {
      average: chartModel[];
      count: chartModel[];
      sats: chartModel[];
    };
  };

  //Menu items
  menuItems = menuItems;
  filterMenuItems = filterMenuItems;

  //Current Menu Selections
  selectedChart: any;
  selectedChartName: string;
  selectedFrequency: string;
  selectedFilter: string;

  constructor(
    private parser: CSVParser,
    private storage: Storage
  ) {}

  async loadData() {
    this.loaded = false;
    this.paymentsExcludeList = await this.storage.get('paymentsExcludeList') || [];
    this.keysendsExcludeList = await this.storage.get('keysendsExcludeList') || [];
    await this.parseRawData('rawForwards');
    await this.parseRawData('rawPayments');
    await this.parseRawData('rawChainFees');
    await this.parseRawData('rawInvoices');
    if (this.rawForwards) {
      this.profit = this.parser.parseProfit(this.forwards, this.keysends, this.chainFees, this.rebalanceFees, this.lightningFees, this.payments);
    }
    this.checkIfHasData()
    if (this.hasData && !this.selectedChart) {
      this.selectDefaultChartMenu(true, true);
    }
    this.loaded = true;
  }

  async parseRawData(rawDataName) {
    const data = await this.storage.get(rawDataName);
    if (data) {
      this.parseDataForChart(data);
    } else if (this[rawDataName+'File'].length > 1) {
      this.parseDataForChart(this[rawDataName+'File']);
    }
  }

  parseDataForChart(data) {
    const rawArray = this.parser.parseRawDataIntoArray(data);
    const type = this.getReportType(rawArray);
    switch (type) {
      case 'forwards':
        this.forwards = this.parser.parseRawArrayIntoChartArray(rawArray, 'forwards');
        return this.saveRawData('forwards', 'rawForwards', rawArray, data);
      case 'invoices':
        this.keysends = this.parser.parseRawArrayIntoChartArray(rawArray, 'keysends', this.keysendsExcludeList);
        return this.saveRawData('invoices', 'rawInvoices', rawArray, data);
      case 'chainFees':
        this.chainFees = this.parser.parseRawArrayIntoChartArray(rawArray, 'chain-fees');
        return this.saveRawData('chainFees', 'rawChainFees', rawArray, data);
      case 'payments':
        this.rebalanceFees = this.parser.parseRawArrayIntoChartArray(rawArray, 'rebalance-fees', this.paymentsExcludeList);
        this.lightningFees = this.parser.parseRawArrayIntoChartArray(rawArray, 'lightning-fees', this.paymentsExcludeList);
        this.payments = this.parser.parseRawArrayIntoChartArray(rawArray, 'payments', this.paymentsExcludeList);
        return this.saveRawData('payments', 'rawPayments', rawArray, data);
    }
  }

  getReportType(array) {
    if (array[0][8] == `""`) {
      return 'forwards';
    } else if (array[0][9] == '"income"') {
      return 'invoices';
    }
    let isOnChainFees = true;
    array.map((item) => {
      if (!item[9]?.includes('"fee:network"') && item[9] !== undefined) {
        isOnChainFees = false;
      }
    });
    if (isOnChainFees) {
      return 'chainFees'
    } else {
      return 'payments'
    }
  }

  saveRawData(lastAddedType, type, array, csv) {
    if (!this[type]) {
      this[type] = csv;
    } else {
      this[type] += `
      ${csv}`;
    }
    this.storage.set(type, this[type]);
    this[type + 'Length'] += array.length;
    this.lastAddedChartType = lastAddedType;
  }

  checkIfHasData() {
    this.menuItems.map((item) => {
      if (this[item.dataName]) {
        this.hasData = true;
        item.hasData = true;
      } else {
        item.hasData = false;
      }
    });
    if (this.forwards) {
      this.menuItems.map((item) => {
        if (item.title == 'Profit') {
          item.hasData = true;
        }
      });
    }
  }

  selectDefaultChartMenu(shouldSelectFrequency, shouldSelectFilter) {
    let didSelectItem = false;
    this.menuItems.map((item) => {
      if (item.hasData && !didSelectItem) {
        this.selectedChartName = item.title;
        this.selectedChart = item.dataName == 'profit' ? this[item.dataName].weekly : this[item.dataName].weekly.sats;
        item.isSelected = true;
        didSelectItem = true;
      }
    });
    if (shouldSelectFrequency) this.selectedFrequency = 'weekly';
    if (shouldSelectFilter) this.selectedFilter = 'sats';
  }

  clearData() {
    this.profit = null;
    this.chainFees = null;
    this.forwards = null;
    this.rebalanceFees = null;
    this.payments = null;
    this.lightningFees = null;
    this.keysends = null;
    this.rawForwards = null;
    this.rawPayments = null;
    this.rawChainFees = null;
    this.rawInvoices = null;
    this.rawForwardsLength = 0;
    this.rawInvoicesLength = 0;
    this.rawChainFeesLength = 0;
    this.rawPaymentsLength = 0;
    this.menuItems.map((item) => item.hasData = false);
    this.hasData = false;
    this.storage.clear();
  }

}
