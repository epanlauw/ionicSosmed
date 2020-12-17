import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowFriendPage } from './show-friend.page';

const routes: Routes = [
  {
    path: '',
    component: ShowFriendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowFriendPageRoutingModule {}
