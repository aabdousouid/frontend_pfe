import { Component } from '@angular/core';
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

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule,TagModule,MessageModule,ToastModule, AvatarModule,CarouselModule,TopbarWidget, HeroWidget, FeaturesWidget, HighlightsWidget,CardModule, PricingWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule],
    template: `
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
            <topbar-widget/>

            <!-- Hero Section -->
            <hero-widget />

            <!-- Features Section -->
            <features-widget id="features"/>

            <!-- How It Works Section -->
            <!-- Testimonials -->
            <highlights-widget />


            <!-- Featured Jobs Section -->
            <pricing-widget />

            <!-- CTA Section -->
            <section class="py-20 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg">
                <div class="max-w-4xl mx-auto text-center">
                    <h2 class="text-4xl font-bold mb-6">
                        Ready to Transform Your Recruitment?
                    </h2>
                    <p class="text-xl mb-8 opacity-90">
                        Join thousands of companies and job seekers who trust our platform
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <p-button 
                            label="Start Hiring Today" 
                            icon="pi pi-arrow-right" 
                            size="large"
                            class=" text-green-600 px-8 py-3" />
                        <p-button 
                            label="Find Your Next Role" 
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
providers:[MessageService]
})
export class Landing { 
    constructor(private service:MessageService) {}

    showSuccessViaToast() {
        console.log('Success message displayed');
        this.service.add({ severity: 'success', summary: 'Success Message', detail: 'Message sent' });
    }
}
