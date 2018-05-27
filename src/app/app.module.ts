import { BrowserModule} from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ChannelPage } from '../pages/channel/channel';
import { AboutUsPage } from '../pages/about-us/about-us';

import { AdminComponent } from '../components/admin/admin';
import { AskComponent } from '../components/ask/ask';
import { QueriesComponent } from '../components/queries/queries';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import { FirebaseStoreProvider } from '../providers/firebase-store/firebase-store';
import { UtilProvider } from '../providers/util/util';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ChannelPage,
    AboutUsPage,
    AdminComponent,
    AskComponent,
    QueriesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChannelPage,
    AboutUsPage,
    AdminComponent,
    AskComponent,
    QueriesComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    UniqueDeviceID,
    FirebaseStoreProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UtilProvider
  ]
})
export class AppModule {}
