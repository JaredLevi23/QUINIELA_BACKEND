import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './shared/pages/about-page/about-page.component';
import { ContactPageComponent } from './shared/pages/contact-page/contact-page.component';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';


const routes: Routes = [
  {
    'path': '',
    component: HomePageComponent
  },
  {
    'path': 'about',
    component: AboutPageComponent
  },
  {
    'path': 'auth',
    'loadChildren': () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    'path': 'contact',
    component: ContactPageComponent
  },
  {
    'path': 'countries',
    loadChildren: () => import('./countries/countries.module')
    .then(m => m.CountriesModule)
  },
  {
    'path': 'dashboard',
    'canActivate': [isAuthenticatedGuard],
    loadChildren: () => import('./dashboard/dashboard.module')
    .then(m => m.DashboardModule)
  },
  {
    'path': '**',
    redirectTo: 'auth',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
