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

import { UniqueDeviceID } from '@ionic-native/unique-device-id';

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
    IonicModule.forRoot(MyApp),
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
    UniqueDeviceID,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
