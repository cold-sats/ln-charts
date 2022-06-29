# ln-charts

ln-charts parses the output of bos accounting commands into various charts for your Lightning Node. It runs on Angular, JS, HTML, CSS, ngx-charts, Ionic Storage and Luxon.

You must have [bos](https://github.com/alexbosworth/balanceofsatoshis) which runs on [lnd](https://github.com/lightningnetwork/lnd) to use this version.

You can run ln-charts locally or access at www.cold-sats.github.io/ln-charts.

## Running Locally

Use Angular CLI to run ln-charts locally. The data you save in cache will persist between sessions.

Download the repository then navigate to it:
```
cd <path-to-ln-charts>
```

Install Angular CLI:
```
npm install -g @angular/cli
```

Run on http://localhost:4200/#/:
```
ng serve --open
```

When running locally you have the option to save your data in the `bos-data` directory instead of inputting it into the UI and saving in cache. Only use one type of data storage at a time (either project files or inputting into UI).

When running locally you can also save keysends / payments exclude list items in the `csv-parser` provider.

ln-charts uses Google Analytics to track usage. If you don't want to allow this, pull the `no-google-analytics` branch which does not include it.

## How to Build Charts

All data that you upload is saved in local cache. Nothing is saved remotely.

**Step 1**: Run bos commands on your Lightning node.

```
bos accounting forwards --month x --year -y --csv
bos accounting chain-fees --month x --year -y --csv
bos accounting payments --month x --year -y --csv
bos accounting invoices --month x --year -y --csv
```

**Step 2**: Copy and paste the output into ln-charts interface.

Only paste one export type at a time. You can include the header at the beginning or not. Don't include any spaces or line breaks at the beginning or end. Example output:

```
"Amount","Asset","Date & Time","Fiat Amount","From ID","Network ID","Notes","To ID","Transaction ID","Type"
-378,"BTC","2022-04-04T17:38:45.000Z",-0.1755226480744611,"","","Channel close: 0:closechannel:shortchanid-794957902071791618 [Chain Fee]","","329f9f7767e4383546ef2942749554f0c1e230f8544db2992261e53d2ec8f365:fee","fee:network"
-292,"BTC","2022-04-04T19:52:57.000Z",-0.13558892390937208,"","","0:openchannel:shortchanid-803136069653233665 [Chain Fee]","","d3e69380718d54bfea8bcf25780fec7e9d2406a2617f044e6c5b51d06fa48a3c:fee","fee:network"
```

## Parsing

ln-charts automatically determines the type of report entered and parses it into multiple charts:

Forwards get parsed into:
- Forwards - sats earned, count, avg. earning, avg. ppm, avg. earning, sats routed

Chain Fees get parsed into:
- Chain Fees - sats spent, count, avg. size

Payments get parsed into:
- Payments - sats sent, count, avg. size
- Rebalance Fees - sats sent, count, avg. size
- Lightning Fees (doesn't include rebalance fees) - sats sent, count, avg. size

Invoices get parsed into:
- Keysends - sats received, count, avg. size

All charts are then summed into a profit chart:
- Profit = forward earnings - chain fees - rebalance fees - lightning fees - payments

## Exclude Lists

ln-charts has an exclude list for payments and keysends. Use it to filter out events you don't want to see in charts.

Example Input for payments exclude list:
```
Wallet of Satoshi
```

Example Input for keysends exclude list:
```
2000000
```

## Backing Up Your Data

I recommend maintaining a local backup of all of your bos accounting data (if you don't run ln-charts locally and save your data in the project folders). You can export stored data as a .txt using the "Export" button shown next to each report in the UI.

## Contributing

Contributions are welcome! Let me know if you find bugs or have ideas. Create an issue or PR.

If you enjoy ln-charts and want to donate please keysend:
```
bos send 020a3dce2dab038955eb435a8342e4fe897304015314485d3738d5f41eccb47859 --amount 1000 --message "Thanks for ln-charts!"
```
