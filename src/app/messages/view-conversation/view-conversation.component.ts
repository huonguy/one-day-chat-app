import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChatSocketService } from 'src/app/services/chat-socket.service';
import { ProcessApisService } from 'src/app/services/process.apis.service';
import { Observable, of } from 'rxjs'
import { IMessageModel } from 'src/app/model/graphql';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-view-conversation',
  templateUrl: './view-conversation.component.html',
  styleUrls: ['./view-conversation.component.css']
})
export class ViewConversationComponent implements OnInit, OnChanges {
  @Input() selectedUser: string;
  @Input() selectedChannel: number;

  AVATAR_URL_JOYSE: string = 'https://angular-test-backend-yc4c5cvnnq-an.a.run.app/Joyse.png';
  AVATAR_URL_SAM: string = 'https://angular-test-backend-yc4c5cvnnq-an.a.run.app/Sam.png';
  AVATAR_URL_RUSSELL: string = 'https://angular-test-backend-yc4c5cvnnq-an.a.run.app/Russell.png';

  newMessage: string;
  messages$: Observable<any[]>;

//   sampleTest: any[] = [
//     {
//       messageId : '1',
//       text: 'huong',
//       datetime: new Date(),
//       userId: 'Sam'
//     },
//     {
//       messageId : '2',
//       text: 'hien',
//       datetime: new Date(),
//       userId: 'Russell'
//     },
//     {
//       messageId : '3',
//       text: 'hai',
//       datetime: new Date(),
//       userId: 'Joyse'
//     },
// ];

  constructor(private processApisService: ProcessApisService, private chatService: ChatSocketService) { }

  ngOnInit(): void {
    // console.log('view-conversation, user: ',this.selectedUser);
    // console.log('view-conversation, channel: ',this.selectedChannel);

    this.chatService.GetMessage().subscribe((message: string[]) => {
      //check message for same channel
      if(message[0] !== String(this.selectedChannel)){
        return;
      }

      //check empty message
      if(!message[1]){
        return;
      }

      const itemObj: IMessageModel = {messageId: '', text: message[1], datetime: new Date(), userId: message[2]};
      this.messages$.subscribe(items=>{
        this.messages$ = of([...items, itemObj]);
      });
    });
  }

  ngOnChanges():void{
    try{
      this.messages$ = this.processApisService.GetLatestMessages(String(this.selectedChannel))
        .pipe(map(items => items.sort((a,b) => {
          return (new Date(b.datetime).getTime() < new Date(a.datetime).getTime() ? 1 : -1);
        })));

      // this.messages$.subscribe(x=>console.log(x))
      // this.messages$ = of(this.sampleTest);

    }catch(err){
      console.log('Error in getting latest messages', err);
    }
  }

  async sendMessage(){
    if(!this.newMessage){
      return;
    }

    try{
      if(await this.processApisService.PostMessage(String(this.selectedChannel), this.newMessage, this.selectedUser).toPromise()){
        this.onReadMoreClick(false);

        //build real-time chat with socket.io
        this.chatService.SendMessage(String(this.selectedChannel), this.newMessage, this.selectedUser);
        this.newMessage = '';
      }
    }catch(err){
      console.log('Error in sending message.', err);
    }
  }

  onReadMoreClick(old: boolean){
    try{
      this.messages$.pipe(map(items => (old === true) ? items[0]: items[items.length-1])).subscribe((data: IMessageModel) => {
        this.processApisService.GetMoreMessages(String(this.selectedChannel), data.messageId, old)
          .pipe(takeWhile(item=> item.length > 0)).subscribe(x => {
            this.messages$ = of(x.sort((a,b) => {
            return (new Date(b.datetime).getTime() < new Date(a.datetime).getTime() ? 1 : -1);
          }));
        })
      });
    }catch(err){
      console.log('Error in reading more message.', err);
    }
  }
}
