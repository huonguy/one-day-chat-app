import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { IMessageModel } from '../model/graphql';

@Injectable({
  providedIn: 'root'
})
export class ProcessApisService {

  constructor(private apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({ uri: 'https://angular-test-backend-yc4c5cvnnq-an.a.run.app/graphql' }),
      cache: new InMemoryCache()
    })
   }

  GetMoreMessages(cId: string, msgId: string, old: boolean): Observable<IMessageModel[]>{
    return this.apollo.query({
           query: gql`query Queries($channelId: String!, $messageId: String!, $old: Boolean!){
            fetchMoreMessages(channelId: $channelId, messageId: $messageId, old: $old){
             messageId,
             text,
             datetime,
             userId
             }
           }`,
           variables: { channelId: cId, messageId: msgId, old: old }
      }).pipe(map((x : ApolloQueryResult<any>) => x.data.fetchMoreMessages.map(response => response)))
   }

 GetLatestMessages(cId: string): Observable<IMessageModel[]>{
   return this.apollo.query({
          query: gql`query Queries($channelId: String!){
          fetchLatestMessages(channelId: $channelId){
            messageId,
            text,
            datetime,
            userId
            }
          }`,
          variables: { channelId: cId }
     }).pipe(map((x : ApolloQueryResult<any>) => x.data.fetchLatestMessages.map(response => response)))
  }

  PostMessage(cId: string, txt: string, uId: string): Observable<any>{
    return this.apollo.mutate({
        mutation: gql `mutation($channelId: String!, $text: String!, $userId: String!){
            postMessage(channelId: $channelId, text: $text, userId: $userId){
              messageId,
              text,
              datetime,
              userId
            }
          }`,
        variables: { channelId: cId, text: txt, userId: uId}
    });
  }
}
