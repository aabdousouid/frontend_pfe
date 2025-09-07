import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-side-chat',
  imports: [CommonModule, FormsModule,DialogModule,
    ButtonModule,
    InputTextModule,
    ScrollPanelModule],
  standalone: true,
  providers: [HttpClient],
  templateUrl: './side-chat.component.html',
  styleUrl: './side-chat.component.scss'
})
export class SideChatComponent {
  @Input() visible :boolean= false;
  userInput = '';
  messages: { from: 'user' | 'bot', text: string }[] = [];

  quickReplies = [
    {label:'Comment postuler ?',value:'Comment postuler dans une platforme de recrutement d\'ACTIA engineerig service?'},
    {label:'Processus de recrutement',value:'Réponse courte sur le processus de recrutement dans une platforme de recrutement entreprise Actia enginnering service'},
    {label:"À propos de l'entreprise",value:'Réponse courte sur l\'entreprise Actia enginnering service'},
];

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.visible = !this.visible;
  }


  // Manual typing: display what the user typed AND send that as payload
  sendMessage(text: string) {
    if (!text?.trim()) return;
    this.messages.push({ from: 'user', text });
    this.userInput = '';
    this.callBackend(text); // payload == text
  }

  // Quick reply: display label, send value
  sendQuickReply(q: { label: string; value: string }) {
    this.messages.push({ from: 'user', text: q.label });
    this.callBackend(q.value); // payload == value
  }

  private callBackend(payload: string) {
    this.http.post<any>('http://localhost:8080/api/cv/chat', { message: payload }).subscribe({
      next: (res) => this.messages.push({ from: 'bot', text: res.reply }),
      error: () => this.messages.push({ from: 'bot', text: "Désolé, une erreur s'est produite." }),
    });
  }

  /* sendMessage(text: string) {
    if (!text.trim()) return;
    this.messages.push({ from: 'user', text });
    this.userInput = '';

    this.http.post<any>('http://localhost:8080/api/cv/chat', { message: text }).subscribe({
      next: (res) => this.messages.push({ from: 'bot', text: res.reply }),
      error: () => this.messages.push({ from: 'bot', text: "Désolé, une erreur s'est produite." }),
    });
  } */
}
