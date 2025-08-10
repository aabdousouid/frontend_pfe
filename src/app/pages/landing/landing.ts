import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbarwidget.component';
import { HeroWidget } from './components/herowidget';
import { FeaturesWidget } from './components/featureswidget';
import { HighlightsWidget } from './components/highlightswidget';
import { PricingWidget } from './components/pricingwidget';
import { FooterWidget } from './components/footerwidget';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { CarouselModule } from 'primeng/carousel';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AnimateOnScroll } from 'primeng/animateonscroll';
import { WebsocketService } from '../../shared/services/websocket.service';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, TagModule, MessageModule, ToastModule, AvatarModule, CarouselModule, AnimateOnScroll, TopbarWidget, HeroWidget, FeaturesWidget, HighlightsWidget, CardModule, PricingWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule],
    template: `
        <p-toast></p-toast>
        <!-- <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="landing-wrapper overflow-hidden">
                <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
                <hero-widget />
                <features-widget />
                <highlights-widget />
                <pricing-widget />
                <footer-widget />
            </div>
        </div> -->
    
    <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="landing-wrapper overflow-hidden">
 <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900">
            <!-- Navigation -->
            <topbar-widget />

            <!-- Hero Section -->
            <hero-widget />

            <!-- Features Section -->
            <features-widget id="features"/>

            <!-- How It Works Section -->
            <!-- Testimonials -->
            <highlights-widget id="how-it-works"/>


            <!-- Featured Jobs Section -->
            <pricing-widget id="jobs" />

            <!-- CTA Section -->
             
            <section class="py-20 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg"
            pAnimateOnScroll
            enterClass="animate-enter fade-in-10 slide-in-from-l-8 animate-duration-1000"
            leaveClass="animate-leave fade-out-0">
                <div class="max-w-4xl mx-auto text-center">
                    <h2 class="text-4xl font-bold mb-6">
                        Prêt à transformer votre recrutement?
                    </h2>
                    <p class="text-xl mb-8 opacity-90">
                        Rejoignez nos différentes entreprises et découvrez les nombreuses opportunités que nous offrons
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <p-button 
                            label="Page de Dashboard" 
                            icon="pi pi-arrow-right" 
                            size="large"
                            routerLink="/app/"
                            class=" text-green-600 px-8 py-3" />
                        <p-button 
                            label="Trouvez votre prochain emploi!" 
                            icon="pi pi-search" 
                            size="large"
                            [outlined]="true"
                            class="border-white text-white  px-8 py-3" />
                    </div>
                </div>
            </section>

            <!-- Footer -->
           
            <footer-widget />
        </div>
        </div>
    </div>
    
`,
styles: [`:host {
                @keyframes slidedown-icon {
                    0% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(20px);
                    }

                    100% {
                        transform: translateY(0);
                    }
                }

                .slidedown-icon {
                    animation: slidedown-icon;
                    animation-duration: 3s;
                    animation-iteration-count: infinite;
                }

                .box {
                    background-image: radial-gradient(var(--primary-300), var(--primary-600));
                    border-radius: 50% !important;
                    color: var(--primary-color-text);
                }
            }`],
providers:[MessageService]
})
export class Landing implements OnInit{ 
    constructor(private service:MessageService,private ws: WebsocketService) {}
    ngOnInit(): void {
      
  }

    
}
