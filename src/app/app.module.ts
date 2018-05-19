import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { AdminComponent } from '../components/admin/admin';
import { AskComponent } from '../components/ask/ask';
import { QueriesComponent } from '../components/queries/queries';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';

export const firebaseConfig = {
  apiKey: "AIzaSyAYHF7bTatSCWGoNjni_vWbivyUGoV6vK8",
  authDomain: "aka-app-786.firebaseapp.com",
  databaseURL: "https://aka-app-786.firebaseio.com",
  projectId: "aka-app-786",
  storageBucket: "aka-app-786.appspot.com",
  messagingSenderId: "613987934072"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    AdminComponent,
    AskComponent,
    QueriesComponent
  ],
  imports: [
    BrowserModule,
    // AngularFireModule.initializeApp(firebaseConfig),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    AdminComponent,
    AskComponent,
    QueriesComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
