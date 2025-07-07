import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
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
  visible = false;
  userInput = '';
  messages: { from: 'user' | 'bot', text: string }[] = [];

  quickReplies = [
    'Quels postes sont ouverts ?',
    'Comment postuler ?',
    'Processus de recrutement',
    "À propos de l'entreprise"
  ];

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.visible = !this.visible;
  }

  sendMessage(text: string) {
    if (!text.trim()) return;
    this.messages.push({ from: 'user', text });
    this.userInput = '';

    this.http.post<any>('http://localhost:8080/api/cv/chat', { message: text }).subscribe({
      next: (res) => this.messages.push({ from: 'bot', text: res.reply }),
      error: () => this.messages.push({ from: 'bot', text: "Désolé, une erreur s'est produite." }),
    });
  }
}
