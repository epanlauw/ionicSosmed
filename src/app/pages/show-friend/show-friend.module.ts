import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowFriendPageRoutingModule } from './show-friend-routing.module';

import { ShowFriendPage } from './show-friend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowFriendPageRoutingModule
  ],
  declarations: [ShowFriendPage]
})
export class ShowFriendPageModule {}
