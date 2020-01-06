import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  // {
  //   path: 'add-event',
  //   loadChildren: () => import('./modals/add-event/add-event.module').then( m => m.AddEventPageModule)
  // },
  // {
  //   path: 'event-info',
  //   loadChildren: () => import('./modals/event-info/event-info.module').then( m => m.EventInfoPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
