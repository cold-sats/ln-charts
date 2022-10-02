import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable()
export class CSVParser {

  //This parser builds a day, week, and month array for each chart type
  dayChart = [];
  weekChart = [];
  monthChart = [];

  //By default payments disclude rebalance fees and routing fees (which are built as separate charts)
  defaultPaymentsExcludeList = [
    '\"Circular payment routing fee\"',
    '\"Routing fee\"'
  ];

  defaultKeysendsExcludeList = [
  ];

  parseRawDataIntoArray(data, delimiter = ',', omitFirstRow = false) {
    let arrays = data
      .slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
      .split('\n')
      .map((v) => v.split(delimiter));
    let array = [];
    arrays.map((item) => {
      if (!item[0].includes('"Amount"') && item.length > 1) {
        array.push(item);
      }
    });
    return array;
  }

  parseRawArrayIntoChartArray(subsetToParse, rawArray, paymentsExcludeList, keysendsExcludeList) {
    this.parseByDayWeekMonth(rawArray, subsetToParse, paymentsExcludeList, keysendsExcludeList);
    this.addMissingEmptyDays();
    this.addMissingEmptyWeeks();
    this.addMissingEmptyMonths();
    const chartArray = this.parseFinalData(subsetToParse);
    this.clearProviderData();
    return chartArray;
  }

  parseByDayWeekMonth(rawArray, subsetToParse, paymentsExcludeList, keysendsExcludeList) {
    let array = [];
    rawArray.map((row) => {
      if (this.isCorrectSubsetToParse(row, subsetToParse, paymentsExcludeList, keysendsExcludeList)) {
        array.push({
          jsDate: this.getJsDate(row[2]),
          luxonDate: this.getLuxonDate(row[2]),
          day: this.getDay(this.getLuxonDate(row[2])),
          amount: parseInt(row[0]),
          routeSize: parseInt(row[6].replace('"', ''))
        });
      }
    });
    array = array.sort((a, b) => a.jsDate - b.jsDate);
    array.map((row) => {
      this.parseIntoDayChart(row.luxonDate, row.day, row.amount, row.routeSize);
      this.parseIntoWeekChart(row.luxonDate, row.amount, row.routeSize);
      this.parseIntoMonthChart(row.luxonDate, row.amount, row.routeSize);
    });
  }

  isCorrectSubsetToParse(row, subsetToParse, paymentsExcludeList, keysendsExcludeList) {
    if (subsetToParse.includes('rebalance-fees')) {
      return row[6] == '\"Circular payment routing fee\"';
    } else if (subsetToParse.includes('lightning-fees')) {
      return row[6] == '\"Routing fee\"';
    } else if (subsetToParse.includes('payments')) {
      return !this.isInPaymentsExcludeList(row[6], paymentsExcludeList);
    } else if (subsetToParse.includes('keysends')) {
      return row[6] == '\"[Push Payment]\"' && !this.isInKeysendsExcludeList(row[0], keysendsExcludeList);;
    } else {
      return true;
    }
  }

  isInPaymentsExcludeList(item, paymentsExcludeList) {
    const isInExcludeList = this.defaultPaymentsExcludeList.includes(item) || paymentsExcludeList?.includes(item);
    const isSelfPayment = item.indexOf('[To Self]') !== -1;
    return isInExcludeList || isSelfPayment;
  }

  isInKeysendsExcludeList(item, keysendsExcludeList) {
    return this.defaultKeysendsExcludeList.includes(item) || keysendsExcludeList?.includes(item);
  }

  parseIntoDayChart(luxonDate, day, amount, routeSize) {
    const dayAlreadyAdded = this.dayChart.find(item => item.name == day);
    if (dayAlreadyAdded) {
      this.dayChart[this.dayChart.length - 1].amounts.push(amount);
      this.dayChart[this.dayChart.length - 1].routeSize.push(routeSize);
    } else {
      this.dayChart.push({
        luxonDate: luxonDate,
        name: day,
        amounts: [ amount ],
        routeSize: [ routeSize ]
      });
    }
  }

  parseIntoWeekChart(luxonDate, amount, routeSize) {
    const weekAlreadyAdded = this.weekChart.find(item => item.luxonDate.weekNumber + item.luxonDate.year == luxonDate.weekNumber + luxonDate.year);
    if (weekAlreadyAdded) {
      this.weekChart[this.weekChart.length - 1].amounts.push(amount);
      this.weekChart[this.weekChart.length - 1].routeSize.push(routeSize);
    } else {
      this.weekChart.push({
        luxonDate: luxonDate,
        name: `Week ${luxonDate.weekNumber} ${luxonDate.year}`,
        amounts: [ amount ],
        routeSize: [ routeSize ],
        weekNumber: luxonDate.weekNumber
      });
    }
  }

  parseIntoMonthChart(luxonDate, amount, routeSize) {
    const monthAlreadyAdded = this.monthChart.find(item => item.luxonDate.monthLong + item.luxonDate.year == luxonDate.monthLong + luxonDate.year);
    if (monthAlreadyAdded) {
      this.monthChart[this.monthChart.length - 1].amounts.push(amount);
      this.monthChart[this.monthChart.length - 1].routeSize.push(routeSize);
    } else {
      this.monthChart.push({
        luxonDate: luxonDate,
        name: `${luxonDate.monthLong} ${luxonDate.year}`,
        amounts: [ amount ],
        routeSize: [ routeSize ],
        monthNumber: luxonDate.month
      });
    }
  }

  addMissingEmptyDays() {
    let array = [];
    this.dayChart.map((day, index) => {
      array.push(day);
      if (this.dayChart[index+1]) {
        const nextDay = day.luxonDate.plus({ days: 1 });
        const isMissingDays = this.getDay(nextDay) !== this.getDay(this.dayChart[index+1].luxonDate);
        if (isMissingDays) {
          const differenceBetweenNextDay = day.luxonDate.diff(this.dayChart[index+1].luxonDate, 'days').days;
          const numberOfMissingDays = Math.ceil(differenceBetweenNextDay) * -1;
          for (let i = 0; i < numberOfMissingDays - 1; i++) {
            const date = day.luxonDate.plus({ days: (i+1) });
            const missingDay = {
              name: this.getDay(date),
              amounts: []
            };
            array.push(missingDay);
          }
        }
      }
    });
    this.dayChart = array;
  }

  addMissingEmptyWeeks() {
    const array: any = [];
    this.weekChart.map((week, i) => {
      array.push(week);
      if (this.weekChart[i+1]) {
        const isMissingWeek = week.weekNumber + 1 !== this.weekChart[i+1].weekNumber;
        const isEndOfYear = week.weekNumber > this.weekChart[i+1].weekNumber && this.weekChart[i+1].weekNumber !== 1;
        if (isMissingWeek || isEndOfYear) {
          const numberOfMissingWeeks = isEndOfYear ?
            52 - week.weekNumber + this.weekChart[i+1].weekNumber - 1 :
            this.weekChart[i+1].weekNumber - week.weekNumber - 1;
          for (let i = 0; i < numberOfMissingWeeks; i++) {
            const luxonDate = week.luxonDate.plus({ weeks: (i+1) });
            const missingWeek = {
              name: `Week ${luxonDate.weekNumber} ${luxonDate.year}`,
              amounts: [],
              luxonDate: luxonDate //used for profit parsing
            };
            array.push(missingWeek);
          }
        }
      }
    });
    this.weekChart = array;
  }

  addMissingEmptyMonths() {
    const array: any = [];
    this.monthChart.map((month, i) => {
      array.push(month);
      if (this.monthChart[i+1]) {
        const isMissingMonth = month.monthNumber + 1 !== this.monthChart[i+1].monthNumber;
        const isEndOfYear = month.monthNumber > this.monthChart[i+1].monthNumber && this.monthChart[i+1].monthNumber !== 2;
        if (isMissingMonth || isEndOfYear) {
          const numberOfMissingMonths = isEndOfYear ?
            12 - month.monthNumber + this.monthChart[i+1].monthNumber - 1 :
            this.monthChart[i+1].monthNumber - month.monthNumber - 1;
          for (let i = 0; i < numberOfMissingMonths; i++) {
            const luxonDate = month.luxonDate.plus({ months: (i+1) });
            const missingMonth = {
              name: `${luxonDate.monthLong} ${luxonDate.year}`,
              amounts: []
            };
            array.push(missingMonth);
          }
        }
      }
    });
    this.monthChart = array;
  }

  parseFinalData(subsetToParse): any {
    let data = {
      daily: {
        sats: this.dayChart.map((day) => {
          return {
            name: day.name,
            value: this.getChartValue(day, 'sats')
          }
        }),
        count: this.dayChart.map((day) => {
          return {
            name: day.name,
            value: this.getChartValue(day, 'count')
          }
        }),
        average: this.dayChart.map((day) => {
          return {
            name: day.name,
            value: this.getChartValue(day, 'average')
          }
        })
      },
      weekly: {
        sats: this.weekChart.map((week) => {
          return {
            name: week.name,
            value: this.getChartValue(week, 'sats'),
            luxonDate: week.luxonDate //used for profit parsing
          }
        }),
        count: this.weekChart.map((week) => {
          return {
            name: week.name,
            value: this.getChartValue(week, 'count')
          }
        }),
        average: this.weekChart.map((week) => {
          return {
            name: week.name,
            value: this.getChartValue(week, 'average')
          }
        })
      },
      monthly: {
        sats: this.monthChart.map((month) => {
          return {
            name: month.name,
            value: this.getChartValue(month, 'sats')
          }
        }),
        count: this.monthChart.map((month) => {
          return {
            name: month.name,
            value: this.getChartValue(month, 'count')
          }
        }),
        average: this.monthChart.map((month) => {
          return {
            name: month.name,
            value: this.getChartValue(month, 'average')
          }
        })
      }
    };
    if (subsetToParse == 'forwards') {
      data = this.addMoreForwardsFilters(data);
    }
    return data;
  }

  getChartValue(array, subsetToParse) {
    if (subsetToParse.includes('sats')) {
      return Math.abs(array.amounts.reduce((a, b) => a + b, 0));
    } else if (subsetToParse.includes('count')) {
      return array.amounts.length;
    } else if (subsetToParse.includes('average')) {
      let total = 0;
      array.amounts.map((item) => total += item);
      return Math.round(Math.abs(total / array.amounts.length)) || 0;
    }
  }

  addMoreForwardsFilters(chartArray) {
    chartArray.daily['routeSize'] = this.dayChart.map((day) => {
      let total = 0;
      day?.routeSize?.map((routeSize) => total += routeSize);
      const avgRouteSize = Math.round(Math.abs(total / day?.routeSize?.length));
      return {
        name: day.name,
        value: avgRouteSize || 0
      }
    });
    chartArray.weekly['routeSize'] = this.weekChart.map((week) => {
      let total = 0;
      week?.routeSize?.map((routeSize) => total += routeSize);
      const avgRouteSize = Math.round(Math.abs(total / week?.routeSize?.length));
      return {
        name: week.name,
        value: avgRouteSize || 0
      }
    });
    chartArray.monthly['routeSize'] = this.monthChart.map((month) => {
      let total = 0;
      month?.routeSize?.map((routeSize) => total += routeSize);
      const avgRouteSize = Math.round(Math.abs(total / month?.routeSize?.length));
      return {
        name: month.name,
        value: avgRouteSize || 0
      }
    });
    chartArray.daily['amountRouted'] = this.dayChart.map((day) => {
      let total = 0;
      day?.routeSize?.map((routeSize) => total += routeSize);
      return {
        name: day.name,
        value: total
      }
    });
    chartArray.weekly['amountRouted'] = this.weekChart.map((week) => {
      let total = 0;
      week?.routeSize?.map((routeSize) => total += routeSize);
      return {
        name: week.name,
        value: total
      }
    });
    chartArray.monthly['amountRouted'] = this.monthChart.map((month) => {
      let total = 0;
      month?.routeSize?.map((routeSize) => total += routeSize);
      return {
        name: month.name,
        value: total
      }
    });
    chartArray.daily['avgPPM'] = this.dayChart.map((day) => {
      let totalRouted = 0;
      day?.routeSize?.map((routeSize) => totalRouted += routeSize);
      let totalEarned = 0;
      day.amounts.map((earned) => totalEarned += earned);
      const avgPPM = Math.round((totalEarned / totalRouted)*1000000);
      return {
        name: day.name,
        value: avgPPM || 0
      }
    });
    chartArray.weekly['avgPPM'] = this.weekChart.map((week) => {
      let totalRouted = 0;
      week?.routeSize?.map((routeSize) => totalRouted += routeSize);
      let totalEarned = 0;
      week.amounts.map((earned) => totalEarned += earned);
      const avgPPM = Math.round((totalEarned / totalRouted)*1000000);
      return {
        name: week.name,
        value: avgPPM || 0
      }
    });
    chartArray.monthly['avgPPM'] = this.monthChart.map((month) => {
      let totalRouted = 0;
      month?.routeSize?.map((routeSize) => totalRouted += routeSize);
      let totalEarned = 0;
      month.amounts.map((earned) => totalEarned += earned);
      const avgPPM = Math.round((totalEarned / totalRouted)*1000000);
      return {
        name: month.name,
        value: avgPPM || 0
      }
    });
    return chartArray;
  }

  parseProfit(forwards, keysends = null, chainFees = null, rebalanceFees = null, lightningFees = null, payments = null) {
    let profit = {
      daily: {
        sats: [],
        cumulative: []
      },
      weekly: {
        sats: [],
        cumulative: []
      },
      monthly: {
        sats: [],
        cumulative: []
      }
    };
    const allDays = this.getAllRange('daily', forwards, keysends, chainFees, rebalanceFees, lightningFees, payments);
    let dailyCumulativeTotal = 0;
    allDays.map((day, i) => {
      const dayForwards = forwards?.daily.sats.find((forward) => forward.name == day);
      const dayKeysends = keysends?.daily.sats.find((keysend) => keysend.name == day);
      const dayChainFees = chainFees?.daily.sats.find((chainFee) => chainFee.name == day);
      const dayRebalanceFees = rebalanceFees?.daily.sats.find((rebalanceFee) => rebalanceFee.name == day);
      const dayLightningFees = lightningFees?.daily.sats.find((lightningFee) => lightningFee.name == day);
      const dayPayments = payments?.daily.sats.find((payment) => payment.name == day);
      const amount = (dayForwards?.value || 0) + (dayKeysends?.value || 0) - (dayChainFees?.value || 0) - (dayRebalanceFees?.value || 0) - (dayLightningFees?.value || 0) - (dayPayments?.value || 0);
      dailyCumulativeTotal += amount;
      profit.daily.sats.push({
        name: day,
        value: amount
      });
      profit.daily.cumulative.push({
        name: day,
        value: dailyCumulativeTotal
      });
    });
    const allWeeks = this.getAllRange('weekly', forwards, keysends, chainFees, rebalanceFees, lightningFees, payments);
    let weeklyCumulativeTotal = 0;
    allWeeks.map((week, i) => {
      const weekForwards = forwards?.weekly.sats.find((forwards) => forwards.name == week);
      const weekKeysends = keysends?.weekly.sats.find((keysend) => keysend.name == week);
      const weekChainFees = chainFees?.weekly.sats.find((chainFee) => chainFee.name == week);
      const weekRebalanceFees = rebalanceFees?.weekly.sats.find((rebalanceFee) => rebalanceFee.name == week);
      const weekLightningFees = lightningFees?.weekly.sats.find((lightningFee) => lightningFee.name == week);
      const weekPayments = payments?.weekly.sats.find((payment) => payment.name == week);
      const amount = (weekForwards?.value || 0) + (weekKeysends?.value || 0) - (weekChainFees?.value || 0) - (weekRebalanceFees?.value || 0) - (weekLightningFees?.value || 0) - (weekPayments?.value || 0);
      weeklyCumulativeTotal += amount;
      profit.weekly.sats.push({
        name: week,
        value: amount
      });
      profit.weekly.cumulative.push({
        name: week,
        value: weeklyCumulativeTotal
      });
    });
    const allMonths = this.getAllRange('monthly', forwards, keysends, chainFees, rebalanceFees, lightningFees, payments);
    let monthlyCumulativeTotal = 0;
    allMonths.map((month, i) => {
      const monthForwards = forwards?.monthly.sats.find((forwards) => forwards.name == month);
      const monthKeysends = keysends?.monthly.sats.find((keysend) => keysend.name == month);
      const monthChainFees = chainFees?.monthly.sats.find((chainFee) => chainFee.name == month);
      const monthRebalanceFees = rebalanceFees?.monthly.sats.find((rebalanceFee) => rebalanceFee.name == month);
      const monthLightningFees = lightningFees?.monthly.sats.find((lightningFee) => lightningFee.name == month);
      const monthPayments = payments?.monthly.sats.find((payment) => payment.name == month);
      const amount = (monthForwards?.value || 0) + (monthKeysends?.value || 0) - (monthChainFees?.value || 0) - (monthRebalanceFees?.value || 0) - (monthLightningFees?.value || 0) - (monthPayments?.value || 0)
      monthlyCumulativeTotal += amount;
      profit.monthly.sats.push({
        name: month,
        value: amount
      });
      profit.monthly.cumulative.push({
        name: month,
        value: monthlyCumulativeTotal
      });
    });
    return profit;
  }

  getAllRange(range, forwards, keysends, chainFees, rebalanceFees, lightningFees, payments) {
    let array = [];
    forwards[range].sats.map((item) => {
      array.push({
        name: item.name,
        luxonDate: item.luxonDate
      });
    });
    if (keysends) {
      keysends[range].sats.map((item) => {
        const alreadyAdded = array.some(arrayItem => arrayItem.name == item.name);
        if (!alreadyAdded) {
          array.push({
            name: item.name,
            luxonDate: item.luxonDate
          });
        }
      });
    }
    if (chainFees) {
      chainFees[range].sats.map((item) => {
        const alreadyAdded = array.some(arrayItem => arrayItem.name == item.name);
        if (!alreadyAdded) {
          array.push({
            name: item.name,
            luxonDate: item.luxonDate
          });
        }
      });
    }
    if (rebalanceFees) {
      rebalanceFees[range].sats.map((item) => {
        const alreadyAdded = array.some(arrayItem => arrayItem.name == item.name);
        if (!alreadyAdded) {
          array.push({
            name: item.name,
            luxonDate: item.luxonDate
          });
        }
      });
    }
    if (lightningFees) {
      lightningFees[range].sats.map((item) => {
        const alreadyAdded = array.some(arrayItem => arrayItem.name == item.name);
        if (!alreadyAdded) {
          array.push({
            name: item.name,
            luxonDate: item.luxonDate
          });
        }
      });
    }
    if (payments) {
      payments[range].sats.map((item) => {
        const alreadyAdded = array.some(arrayItem => arrayItem.name == item.name);
        if (!alreadyAdded) {
          array.push({
            name: item.name,
            luxonDate: item.luxonDate
          });
        }
      });
    }
    let returnArray = [];
    if (range == 'weekly') {
      array.sort((a, b) => a.luxonDate - b.luxonDate);
      array.map((item) => returnArray.push(item.name));
    } else {
      array.sort((a, b) => new Date(a.name).valueOf() - new Date(b.name).valueOf());
      array.map((item) => returnArray.push(item.name));
    }
    return returnArray;
  }

  clearProviderData() {
    this.dayChart = [];
    this.weekChart = [];
    this.monthChart = [];
  }

  getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    const monthName = date.toLocaleString("default", { month: "long", timeZone: 'UTC' });
    return monthName;
  }

  getLuxonDate(rawDate) {
    const date = rawDate.replaceAll('"', '');
    return DateTime.fromISO(date, { zone: 'UTC' });
  }

  getJsDate(rawDate) {
    const date = rawDate.replaceAll('"', '');
    return new Date(date);
  }

  getDay(luxonDate) {
    const formattedDate = luxonDate.toLocaleString(DateTime.DATETIME_SHORT);
    const dayArray = formattedDate.split(',');
    return dayArray[0];
  }

}
