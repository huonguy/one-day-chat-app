import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { ViewConversationComponent } from './view-conversation/view-conversation.component';
import { MessagesComponent } from './messages/messages.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ViewConversationComponent, MessagesComponent],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    FormsModule
  ]
})
export class MessagesModule { }
