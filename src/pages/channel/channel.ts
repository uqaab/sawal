import { Component } from '@angular/core';
import { IonicPage, Platform, NavController } from 'ionic-angular';

import { FirebaseStoreProvider } from '../../providers/firebase-store/firebase-store';

@IonicPage()
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
})
export class ChannelPage {

  // activeTab: string = "admin";
  // activeTab: string = "queries";
  activeTab: string = "ask";
  channelProfile: any = {};
  fetching: boolean = false;
  isAndroid: boolean = false;

  constructor(
    public navCtrl: NavController,
    platform: Platform,
    private firebaseStore: FirebaseStoreProvider
  ) {
    this.isAndroid = platform.is('android');
    this.fetchChannelProfile();
  }

  // fetches channel profile
  fetchChannelProfile() {
    const self = this;
    const channelId = this.firebaseStore.getActiveChannelId();

    self.fetching = true;
    return this.firebaseStore.getChannelProfile(channelId)
      .then(channelProfile => {
        console.log('fetchChannelProfile: success - ', channelProfile);
        self.fetching = false;
        self.channelProfile = channelProfile;
        console.log('fetchChannelProfile:', channelProfile);
      })
    .catch(error => {
      console.log('fetchChannelProfile: error - ', error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChannelPage');
  }

}
