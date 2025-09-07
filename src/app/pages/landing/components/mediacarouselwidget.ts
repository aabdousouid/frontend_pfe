import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AnimateOnScroll } from 'primeng/animateonscroll';

interface MediaItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string; // For video thumbnails
  title: string;
  description: string;
  category: string;
}

@Component({
  selector: 'media-carousel-widget',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, TagModule, AnimateOnScroll],
  template: `
    <section class="py-20 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 bg-white dark:bg-gray-900"
             pAnimateOnScroll
             enterClass="animate-enter fade-in-10 slide-in-from-b-8 animate-duration-1000"
             leaveClass="animate-leave fade-out-0">
      
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Découvrez Nos Actualités
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Restez informé des dernières nouvelles, événements et opportunités de notre plateforme de recrutement
        </p>
      </div>

      <div class="relative">
        <p-carousel
          [value]="mediaItems"
          [numVisible]="3"
          [numScroll]="1"
          [circular]="true"
          [autoplayInterval]="5000"
          [responsiveOptions]="responsiveOptions"
          [showNavigators]="true"
          [showIndicators]="true"
          class="custom-carousel">
          
          <ng-template pTemplate="item" let-media>
            <div class="p-4">
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                
                <!-- Media Content -->
                <div class="relative h-64 overflow-hidden">
                  <!-- Image -->
                  <div *ngIf="media.type === 'image'" class="w-full h-full">
                    <img 
                      [src]="media.src" 
                      [alt]="media.title"
                      class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                  
                  <!-- Video -->
                  <div *ngIf="media.type === 'video'" class="w-full h-full">
                    <video 
                      *ngIf="!media.src.includes('youtube') && !media.src.includes('youtu.be')"
                      [poster]="media.thumbnail"
                      controls
                      class="w-full h-full object-cover"
                      [muted]="true"
                      preload="metadata">
                      <source [src]="media.src" type="video/mp4">
                      <source [src]="getWebMVersion(media.src)" type="video/webm">
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                  </div>
                  
                  <!-- Category Tag -->
                  <div class="absolute top-4 left-4">
                    <p-tag 
                      [value]="media.category" 
                      severity="success"
                      class="text-sm font-semibold" />
                  </div>
                  
                  <!-- Media Type Icon -->
                  <div class="absolute top-4 right-4">
                    <div class="bg-black bg-opacity-50 rounded-full p-2">
                      <i [class]="media.type === 'video' ? 'pi pi-play text-white' : 'pi pi-image text-white'"></i>
                    </div>
                  </div>
                </div>
                
                <!-- Content -->
                <div class="p-6">
                  <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
                    {{ media.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                    {{ media.description }}
                  </p>
                  
                  <!-- <div class="flex justify-between items-center mt-4">
                    <p-button 
                      label="Voir plus" 
                      icon="pi pi-arrow-right" 
                      size="small"
                      [text]="true"
                      class="text-green-600" />
                    
                    <div class="flex gap-2">
                      <p-button 
                        icon="pi pi-heart" 
                        size="small"
                        [text]="true"
                        [rounded]="true"
                        severity="secondary" />
                      <p-button 
                        icon="pi pi-share-alt" 
                        size="small"
                        [text]="true"
                        [rounded]="true"
                        severity="secondary" />
                    </div>
                  </div> -->
                </div>
              </div>
            </div>
          </ng-template>
        </p-carousel>
      </div>
      
      <!-- View All Button -->
      <div class="text-center mt-12">
        <p-button 
          label="Voir Toutes Les Actualités" 
          icon="pi pi-external-link" 
          size="large"
          [outlined]="true"
          severity="success"
          class="px-8 py-3" />
      </div>
    </section>
  `,
  styles: [`
    :host ::ng-deep {
      .custom-carousel .p-carousel-content {
        overflow: visible;
      }
      
      .custom-carousel .p-carousel-item {
        transition: all 0.3s ease;
      }
      
      .custom-carousel .p-carousel-item:hover {
        transform: translateY(-5px);
      }
      
      .custom-carousel .p-carousel-indicators {
        gap: 0.5rem;
      }
      
      .custom-carousel .p-carousel-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        transition: all 0.3s ease;
      }
      
      .custom-carousel .p-carousel-indicator.p-highlight {
        background-color: #10b981;
        transform: scale(1.2);
      }
      
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  `]
})
export class MediaCarouselWidget implements OnInit {
  mediaItems: MediaItem[] = [];
  
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
 getWebMVersion(mp4Src: string): string {
    return mp4Src.replace('.mp4', '.webm');
  }
  ngOnInit() {
    this.mediaItems = [
      {
        id: 1,
        type: 'image',
        src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
        title: 'Forum Emploi 2024',
        description: 'Découvrez les opportunités d\'emploi présentées lors de notre grand forum annuel avec plus de 150 entreprises participantes.',
        category: 'Événement'
      },
      
      {
        id: 3,
        type: 'image',
        src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop',
        title: 'Nouvelle Fonctionnalité IA',
        description: 'Notre intelligence artificielle révolutionnaire aide maintenant les candidats à optimiser leurs CV automatiquement.',
        category: 'Innovation'
      },
      {
        id: 4,
        type: 'video',
        src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
        title: 'Atelier CV & Entretien',
        description: 'Participez à nos ateliers gratuits pour améliorer vos techniques d\'entretien et optimiser votre présentation.',
        category: 'Formation'
      },
      
      {
        id: 6,
        type: 'image',
        src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
        title: 'Équipe en Expansion',
        description: 'Notre équipe grandit ! Nous recrutons des talents passionnés pour nous aider à révolutionner le recrutement.',
        category: 'Recrutement'
      }
    ];
  }
}