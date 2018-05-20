import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { FirebaseStoreProvider } from '../../providers/firebase-store/firebase-store';

@IonicPage()
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
})
export class ChannelPage {

  //activeTab: string = "admin";
  activeTab: string = "queries";
  //activeTab: string = "ask";
  channelProfile: any = {};
  fetching: boolean = false;

  constructor(
    public navCtrl: NavController,
    private firebaseStore: FirebaseStoreProvider
  ) {
    this.fetchChannelProfile();
  }

  // fetches channel profile
  fetchChannelProfile() {
    const self = this;
    const channelId = this.firebaseStore.getActiveChannelId();

    self.fetching = true;
    return this.firebaseStore.getChannelProfile(channelId)
      .then(channelProfile => {
        self.fetching = false;
        self.channelProfile = channelProfile;
      })
    .catch(error => {
      console.log('fetchChannelProfile: error - ', error);
    });
  }

}
