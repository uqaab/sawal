import { BrowserModule} from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ChannelPage } from '../pages/channel/channel';
import { ListPage } from '../pages/list/list';

import { AdminComponent } from '../components/admin/admin';
import { AskComponent } from '../components/ask/ask';
import { QueriesComponent } from '../components/queries/queries';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FirebaseStoreProvider } from '../providers/firebase-store/firebase-store';

import { Firebase } from '@ionic-native/firebase';
import { UtilityProvider } from '../providers/utility/utility';

import { UniqueDeviceID } from '@ionic-native/unique-device-id';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ChannelPage,
    ListPage,
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
    ListPage,
    AdminComponent,
    AskComponent,
    QueriesComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    FirebaseStoreProvider,
    UniqueDeviceID,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UtilityProvider
  ]
})
export class AppModule {}
