import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {
  public message$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  constructor() { }

  socket = io('http://localhost:3000');

  SendMessage(channelId: string, message: string, userId: string){
    console.log("sending userid", userId);
    this.socket.emit('message', channelId, message, userId);
  }

  GetMessage(){
    this.socket.on('message', (channelId, message, userId) => {
      console.log("getting userid", userId);
      this.message$.next([channelId, message, userId]);
    });
    return this.message$.asObservable();
  }
}
