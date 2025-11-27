import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Modulos
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { ErrorHandlerService } from './core/error-handling/error-handler.service';

import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { LayoutModule } from './layout/layout.module';

import { MEAL_PLAN_REPOSITORY, PLANNER_SERVICE, DISH_REPOSITORY, USER_REPOSITORY } from './core/tokens';
import { DishFirebaseRepository } from './infrastructure/firebase/repositories/dish.firebase.repository';
import { UserFirebaseRepository } from './infrastructure/firebase/repositories/user.firebase.repository';
import { SharedModule } from './shared/shared.module';
import { MealPlanFirebaseRepository } from './infrastructure/firebase/repositories/mealplan.firebase.repository';
import { SimpleHeuristicPlannerService } from './application/services/simple-heuristic-planner.service';



@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    SharedModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  bootstrap: [AppComponent],
  providers: [
    // FirebaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    { provide: DISH_REPOSITORY, useClass: DishFirebaseRepository },
    { provide: USER_REPOSITORY, useClass: UserFirebaseRepository },
    { provide: MEAL_PLAN_REPOSITORY, useClass: MealPlanFirebaseRepository },
    { provide: PLANNER_SERVICE, useClass: SimpleHeuristicPlannerService },
    { provide: ErrorHandler, useClass: ErrorHandlerService }
  ]
})
export class AppModule { }