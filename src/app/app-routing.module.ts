import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddDataPage } from 'src/pages/add-data/add-data';
import { ChartPage } from 'src/pages/chart/chart';
import { KeysendsExcludeListPage } from 'src/pages/keysends-exclude-list/keysends-exclude-list';
import { PaymentsExcludeListPage } from 'src/pages/payments-exclude-list/payments-exclude-list';
import { ColdSatsPage } from 'src/pages/cold-sats/cold-sats';

const routes: Routes = [
  { path: 'add-data', component: AddDataPage },
  { path: '', component: ChartPage },
  { path: 'keysends-exclude-list', component: KeysendsExcludeListPage },
  { path: 'payments-exclude-list', component: PaymentsExcludeListPage },
  { path: 'cold-sats', component: ColdSatsPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
