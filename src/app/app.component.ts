import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import { ChannelPage } from '../pages/channel/channel';
import { HomePage } from '../pages/home/home';
import { AboutUsPage } from '../pages/about-us/about-us';

import { UtilProvider } from '../providers/util/util';
import { FirebaseStoreProvider } from '../providers/firebase-store/firebase-store';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = ChannelPage;
  rootPage: any = HomePage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private utilService: UtilProvider,
    private firebaseStore: FirebaseStoreProvider
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'About', component: AboutUsPage }
    ];
  }

  initializeApp() {

    // init our app firebase store
    this.firebaseStore.init();

    this.utilService.onPlatformReady().then(() => this.onPlatformReady());
  }

  // Okay, so the platform is ready and our plugins are available.
  // Here you can do any higher level native things you might need.
  onPlatformReady() {

    /* plugins stuff starts */
    // android specific settings
    if (this.platform.is('android')) {
      this.statusBar.styleLightContent();

      // ios, windows specific settings
    } else {
      this.statusBar.styleDefault();
    }

    // common settings
    this.splashScreen.hide();

    /* plugins stuff ends */
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
