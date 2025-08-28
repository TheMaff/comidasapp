import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Modulos
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AuthModule } from './auth/auth.module';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { LayoutModule } from './layout/layout.module';

import { RECIPE_REPOSITORY, USER_REPOSITORY } from './core/tokens';
import { RecipeFirebaseRepository } from './infrastructure/firebase/repositories/recipe.firebase.repository';
import { UserFirebaseRepository } from './infrastructure/firebase/repositories/user.firebase.repository';
import { SharedModule } from './shared/shared.module';



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
    MaterialModule,

    // FirebaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    AuthModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: RECIPE_REPOSITORY, useClass: RecipeFirebaseRepository },
    { provide: USER_REPOSITORY, useClass: UserFirebaseRepository },
  ]
})
export class AppModule { }