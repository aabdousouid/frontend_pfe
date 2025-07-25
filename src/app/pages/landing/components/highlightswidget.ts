import { Component } from '@angular/core';
import { AnimateOnScroll } from 'primeng/animateonscroll';
import { Avatar, AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'highlights-widget',
    imports: [AvatarModule,CardModule,AnimateOnScroll],
    template: `
       <!--  <div id="highlights" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
            <div class="text-center">
                <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Powerful Everywhere</div>
                <span class="text-muted-color text-2xl">Amet consectetur adipiscing elit...</span>
            </div>

            <div class="grid grid-cols-12 gap-4 mt-20 pb-2 md:pb-20">
                <div class="flex justify-center col-span-12 lg:col-span-6 bg-purple-100 p-0 order-1 lg:order-none" style="border-radius: 8px">
                    <img src="https://primefaces.org/cdn/templates/sakai/landing/mockup.png" class="w-11/12" alt="mockup mobile" />
                </div>

                <div class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right gap-4">
                    <div class="flex items-center justify-center bg-purple-200 self-center lg:self-end" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                        <i class="pi pi-fw pi-mobile !text-4xl text-purple-700"></i>
                    </div>
                    <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Congue Quisque Egestas</div>
                    <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal ml-0 md:ml-2" style="max-width: 650px"
                        >Lectus arcu bibendum at varius vel pharetra vel turpis nunc. Eget aliquet nibh praesent tristique magna sit amet purus gravida. Sit amet mattis vulputate enim nulla aliquet.</span
                    >
                </div>
            </div>

            <div class="grid grid-cols-12 gap-4 my-20 pt-2 md:pt-20">
                <div class="col-span-12 lg:col-span-6 my-auto flex flex-col text-center lg:text-left lg:items-start gap-4">
                    <div class="flex items-center justify-center bg-yellow-200 self-center lg:self-start" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                        <i class="pi pi-fw pi-desktop !text-3xl text-yellow-700"></i>
                    </div>
                    <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Celerisque Eu Ultrices</div>
                    <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal mr-0 md:mr-2" style="max-width: 650px"
                        >Adipiscing commodo elit at imperdiet dui. Viverra nibh cras pulvinar mattis nunc sed blandit libero. Suspendisse in est ante in. Mauris pharetra et ultrices neque ornare aenean euismod elementum nisi.</span
                    >
                </div>

                <div class="flex justify-end order-1 sm:order-2 col-span-12 lg:col-span-6 bg-yellow-100 p-0" style="border-radius: 8px">
                    <img src="https://primefaces.org/cdn/templates/sakai/landing/mockup-desktop.png" class="w-11/12" alt="mockup" />
                </div>
            </div>
        </div> -->
    <!-- How It Works Section -->
       <section id="how-it-works" class="py-20 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20" pAnimateOnScroll
            enterClass="animate-enter fade-in-10 slide-in-from-l-8 animate-duration-1000"
            leaveClass="animate-leave fade-out-0">
                <div class="max-w-6xl mx-auto">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Comment ça marche
                        </h2>
                        <p class="text-xl text-gray-600 dark:text-gray-300">
                            Des étapes simples pour mettre en relation les talents et les opportunités.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <!-- For Job Seekers -->
                        <div>
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                                <i class="pi pi-user text-green-600 mr-2"></i>
                                Pour les Candidats
                            </h3>
                            <div class="space-y-6">
                                <div class="flex items-start gap-4">
                                    <div class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                                    <div>
                                        <h4 class="font-semibold text-lg mb-2">Créez votre profil</h4>
                                        <p class="text-gray-600 dark:text-gray-300">Créez un profil complet mettant en valeur vos compétences, votre expérience et vos objectifs de carrière.</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4">
                                    <div class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                                    <div>
                                        <h4 class="font-semibold text-lg mb-2">Obtenir des recommandations</h4>
                                        <p class="text-gray-600 dark:text-gray-300">Notre IA trouve des offres d'emploi qui correspondent à vos compétences et à vos préférences..</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4">
                                    <div class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                                    <div>
                                        <h4 class="font-semibold text-lg mb-2">Commencez votre parcours</h4>
                                        <p class="text-gray-600 dark:text-gray-300">Postulez en quelques clics et suivez vos candidatures grâce à notre tableau de bord.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- For Employers -->
                        <div>
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                                <i class="pi pi-building text-green-600 mr-2"></i>
                                Pour les recruteurs
                            </h3>
                            <div class="space-y-6">
                                <div class="flex items-start gap-4">
                                    <div class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                                    <div>
                                        <h4 class="font-semibold text-lg mb-2">Publier des offres d'emploi</h4>
                                        <p class="text-gray-600 dark:text-gray-300">Créer des offres d'emploi détaillées avec les exigences et les informations sur nécessaire.</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4">
                                    <div class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                                    <div>
                                        <h4 class="font-semibold text-lg mb-2">Consulter les candidatures</h4>
                                        <p class="text-gray-600 dark:text-gray-300">Parcourir les candidats sélectionnés et examiner leur profil et leurs qualifications.</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4">
                                    <div class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                                    <div>
                                        <h4 class="font-semibold text-lg mb-2">Embaucher les talents</h4>
                                        <p class="text-gray-600 dark:text-gray-300">Entrez en contact avec les meilleurs talents et gérez l'ensemble du processus de recrutement en toute transparence.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             <!-- Testimonials -->
            <section class="py-20 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div class="max-w-6xl mx-auto">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Ce que notre plateforme offre!
                        </h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <p-card>
                            <div class="text-center">
                                <p-avatar icon="pi pi-shield text-green-600" size="xlarge" class="mb-4" />
                                <blockquote class="text-gray-600 dark:text-gray-300 mb-4">
                                    Security
                                </blockquote>
                               <!--  <cite class="font-semibold">Sarah Johnson</cite> -->
                                <div class="text-sm text-gray-500">Comptes et accès sécurisés pour nos utilisateurs</div>
                            </div>
                        </p-card>

                        <p-card>
                            <div class="text-center">
                                <p-avatar icon="pi pi-users text-orange-600" size="xlarge" class="mb-4"  />
                                <blockquote class="text-gray-600 dark:text-gray-300 mb-4">
                                    Tranparence
                                </blockquote>
                                <!-- <cite class="font-semibold">Mike Chen</cite> -->
                                <div class="text-sm text-gray-500">Un procès de recrutement clair et rapide</div>
                            </div>
                        </p-card>

                        <p-card>
                            <div class="text-center">
                                <p-avatar icon="pi pi-desktop" size="xlarge" class="mb-4" />
                                <blockquote class="text-gray-600 dark:text-gray-300 mb-4">
                                    User Experience
                                </blockquote>
                                <!-- <cite class="font-semibold">Lisa Rodriguez</cite> -->
                                <div class="text-sm text-gray-500">une qualité d'utilisation optimale pour tous les utilisateurs</div>
                            </div>
                        </p-card>
                    </div>
                </div>
            </section>     




    `
})
export class HighlightsWidget {}
