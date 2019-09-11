import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WordComponent } from './word/word.component';
import { ConfigComponent } from './config/config.component';
import { AddComponent } from './add/add.component';


const routes: Routes = [
  {
    path: 'word',
    component: WordComponent
  },
  {
    path: 'config',
    component: ConfigComponent
  },
  {
    path: 'add',
    component: AddComponent
  },
  {
    path: '',
    redirectTo: '/word',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/word',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
