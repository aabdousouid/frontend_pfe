import { Injectable } from '@angular/core';
import { Client, Message, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
private client: Client;
  notification$ = new Subject<any>();

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      debug: (msg) => console.log(msg),
    });

    this.client.onConnect = () => {
      this.client.subscribe('/user/queue/notifications', (msg: Message) => {
        this.notification$.next(JSON.parse(msg.body));
      });
    };

    this.client.activate();
  }
}
