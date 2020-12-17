import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesPage } from './pages.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/pages/tabs/profile-home',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    component: PagesPage,
    children: [
      {
        path: 'home-map',
        loadChildren: () => import('./home-map/home-map.module').then(m => m.HomeMapPageModule)
      },
      {
        path: 'add-friend',
        loadChildren: () => import('./add-friend/add-friend.module').then(m => m.AddFriendPageModule)
      },
      {
        path: 'profile-home',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'show-friends',
        loadChildren: () => import('./show-friend/show-friend.module').then(m => m.ShowFriendPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule {}
