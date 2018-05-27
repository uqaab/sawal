import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  isAdmin: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private firebaseStore: FirebaseStoreProvider
  ) {
    console.log('navCtrl', navCtrl);
    console.log('navParams', navParams);
    this.isAdmin = navParams.data.isAdmin;
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
