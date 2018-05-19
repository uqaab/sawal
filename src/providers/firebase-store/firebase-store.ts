import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

import * as firebase from 'firebase';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';


@Injectable()
export class FirebaseStoreProvider {

  refs: any = {};
  deviceId: string;
  config: any = {
    apiKey: "AIzaSyBA1_7kjG2cYEyz2UAtHySoBtjR7a1Bm7E",
    authDomain: "sawal-app-e2ef9.firebaseapp.com",
    databaseURL: "https://sawal-app-e2ef9.firebaseio.com",
    projectId: "sawal-app-e2ef9",
    storageBucket: "",
    messagingSenderId: "102631740478"
  };

  constructor(public http: HttpClient, private uniqueDeviceID: UniqueDeviceID, public alertCtrl: AlertController) {
    console.log('FirebaseStoreProvider');
  }

  // main initialization logic - one-time only
  init () {
    const self = this;

    // get phone's device id to consider it as unique username
    this.getDeviceId()
      .then((uuid: any) => {
        console.log('uuid', uuid);
        self.deviceId = uuid;

        let alert = this.alertCtrl.create({
          title: 'Device ID',
          subTitle: 'Your device id is : ' + uuid,
          buttons: ['OK']
        });

        alert.present();

        // init firebase SDK
        firebase.initializeApp(self.config);

        // build the required References
        self.buildRefs();
      })
      .catch((error: any) => {
        console.log('device-id - failed initializing app - could not read device-id', error);

        // alert modal  - failed initializing app - could not read device-id
      });
  }

  getDeviceIdSync() {
    return this.deviceId;
  }

  // returns the device id once retrieved already
  getDeviceId() {
    return location.hostname === 'localhost' ? this.getTestDeviceId() : this.uniqueDeviceID.get();
  }

  // returns test device-id for development purpose
  getTestDeviceId() {
    return new Promise(resolve => resolve('test-device-id'));
  }

  // returns the references to be consumed across app
  getRefs () {
    return this.refs;
  }

  // builds the references one-time only
  buildRefs () {
    const appDb = firebase.database();

    this.refs.channelsCodeRef = appDb.ref('channels-codes');
    this.refs.channelsRef = appDb.ref('channels');

    this.refs.questionsRef = appDb.ref('questions');
    this.refs.commentsRef = appDb.ref('comments');

    this.refs.usersRef = appDb.ref('users');
  }
}
