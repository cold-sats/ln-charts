import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { providers } from 'src/app/providers';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { IonicStorageModule } from '@ionic/storage';

import { MenuComponent } from 'src/menu/menu';

import { AddDataPage } from 'src/pages/add-data/add-data';
import { ChartPage } from 'src/pages/chart/chart';
import { KeysendsExcludeListPage } from 'src/pages/keysends-exclude-list/keysends-exclude-list';
import { PaymentsExcludeListPage } from 'src/pages/payments-exclude-list/payments-exclude-list';
import { ColdSatsPage } from 'src/pages/cold-sats/cold-sats';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AddDataPage,
    ChartPage,
    KeysendsExcludeListPage,
    PaymentsExcludeListPage,
    ColdSatsPage
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    IonicStorageModule.forRoot()
  ],
  exports: [
    MenuComponent,
    AddDataPage,
    ChartPage,
    KeysendsExcludeListPage,
    PaymentsExcludeListPage,
    ColdSatsPage
  ],
  providers: [
    ...providers
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
