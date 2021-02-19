import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CreditCardComponent } from './components/credit-card/credit-card.component';

const routes: Routes = [
  {
    path: 'app',
    component: AppComponent,
  },
  {
    path:'payment',
    component: CreditCardComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
