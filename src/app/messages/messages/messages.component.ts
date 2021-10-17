import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  selectedUser: string = "Joyse";
  selectedChannel: number = 0;
  channelList: string[] = ["General Channel", "Technology Channel", "LGTM Channel"];

  constructor() { }

  ngOnInit(): void {
  }

  onChannelChanged(event: number){
    this.selectedChannel = event;
  }
}


