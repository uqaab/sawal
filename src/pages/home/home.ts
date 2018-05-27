import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { FirebaseStoreProvider } from '../../providers/firebase-store/firebase-store';
import { ChannelPage } from '../channel/channel';

interface IChannelData{
  accessType?: string;
  channelCode?: number;
  adminPIN?: number;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userName: string;
  newUserName: string;
  channelData: IChannelData = {accessType: 'user'};
  fetching: boolean = false;
  registering: boolean = false;
  joining: boolean = false;

  constructor(private navCtrl: NavController, private firebaseStore: FirebaseStoreProvider, private alertCtrl: AlertController) {
    this.connect();
  }

  // connects to firebase to validate the device against existing users.
  connect() {
    const self = this;
    this.fetching = true;
    this.firebaseStore.getDeviceId()
      .then(uuid => {

        self.firebaseStore.getUserProfile(uuid)
          .then((userProfile: any) => {
            self.fetching = false;

            // if new user.
            if (userProfile === null) {
              //console.log('new user');
              // if device has been registered previously
            } else {
              self.userName = userProfile.name;
              //console.log('existing user', self.userName);
            }
          })
          .catch(error => {

            this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Could not connect. - Please connect to Internet and restart App.',
              buttons: ['OK']
            }).present();
          });
      });
  }

  // registers the new user
  registerUser($event) {

    $event.preventDefault();

    // validate channel code
    if (!this.newUserName) {

      return this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Please enter your name.',
        buttons: ['OK']
      }).present();
    }

    this.registering = true;
    this.firebaseStore.registerUser(this.newUserName)
      .then(() => {
        this.registering = false;
        this.userName = this.newUserName;

        this.alertCtrl.create({
          title: 'Successful !',
          subTitle: 'You have been registered successfully.',
          buttons: ['Join Channel']
        }).present();
      })
      .catch(error => {
        this.registering = false;

        this.alertCtrl.create({
          title: 'Error',
          subTitle: error,
          buttons: ['OK']
        }).present();
      });
  }

  // attempts to join the channel
  joinChannel($event) {
    const isAdminAccess = this.channelData.accessType === 'admin';

    $event.preventDefault();

    // validate channel code
    if (!this.channelData.channelCode) {

      return this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Please enter channel code',
        buttons: ['OK']
      }).present();
    }

    // validate admin code if admin access requested
    if (isAdminAccess && !this.channelData.adminPIN) {

      return this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Please enter Admin code',
        buttons: ['OK']
      }).present();
    }

    this.joining = true;
    this.firebaseStore.validateChannelCodes(this.channelData)
      .then((channelId) => {
        this.joining = false;

        // remember the channelId
        this.firebaseStore.setActiveChannelId(channelId);

        // navigate to channel page
        this.navCtrl.push(ChannelPage, {
          isAdmin: isAdminAccess
        });
      })
      .catch(error => {
        this.joining = false;

        this.alertCtrl.create({
          title: 'Error',
          subTitle: error,
          buttons: ['OK']
        }).present();
      });
  }
}
