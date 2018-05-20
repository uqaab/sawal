import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

import * as firebase from 'firebase';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

interface IRefs {
  channelsCodeRef?: any;
  channelsRef?: any;
  questionsRef?: any;
  commentsRef?: any;
  usersRef?: any;
}

export class FirebaseConfig {
  apiKey: string = 'AIzaSyBA1_7kjG2cYEyz2UAtHySoBtjR7a1Bm7E';
  authDomain: string = 'sawal-app-e2ef9.firebaseapp.com';
  databaseURL: string = 'https://sawal-app-e2ef9.firebaseio.com';
  projectId: string = 'sawal-app-e2ef9';
  storageBucket: string = '';
  messagingSenderId: string = '102631740478';
}

@Injectable()
export class FirebaseStoreProvider {
  refs: IRefs = {};
  firebaseConfig: FirebaseConfig;
  activeChannelId: string = '123123123';
  deviceId: string;
  deviceIdPromise: any;
  constructor(
    public http: HttpClient,
    private uniqueDeviceID: UniqueDeviceID,
    public alertCtrl: AlertController
  ) {
    console.log('FirebaseStoreProvider');
    this.firebaseConfig = new FirebaseConfig();
  }

  // main initialization logic - one-time only
  public init () {
    const self = this;

    // get phone's device id to consider it as unique username
    this.deviceIdPromise = this.getDeviceId();

    this.deviceIdPromise
      .then((uuid: any) => {
        console.log('uuid', uuid);
        self.deviceId = uuid;

        // this.alertCtrl.create({
        //   title: 'Device ID',
        //   subTitle: 'Your device id is : ' + uuid,
        //   buttons: ['OK']
        // }).present();

        // init firebase SDK
        firebase.initializeApp(self.firebaseConfig);

        // build the required References
        self.buildRefs();
      })
      .catch((error: any) => {
        console.log('device-id - failed initializing app - could not read device-id', error);

        // alert modal  - failed initializing app - could not read device-id
      });
  }

  // registers the user against the unique device-id
  submitQuestion(questionText, channelId) {

    // by default push the question to active channel
    channelId = channelId || this.activeChannelId;

    return new Promise((resolve, reject) => {
      let question = {
        approvedBy: null,
        approvedOn: null,
        askedBy: this.deviceId,
        askedOn: Date.now(),
        comments: {},
        text: questionText,
        type: 0, // 0 for questions, 1 for poll, etc for later scaling.
        votes: {}
      };

      // add into questions namespace
      const questionId: string = this.refs.questionsRef.push().key;
      this.refs.questionsRef.child(questionId).set(question, error => {
        if (error) {
          console.log('submitQuestion: questions ref: error - ', error);
          reject('Question submission failed. ' + error);
        }

        // add question entry into channel's questions list.
        this.refs.channelsRef.child(channelId).child('questions').child(questionId).set(true, error => {
          if (error) {
            console.log('submitQuestion: channels ref: error - ', error);
            reject('Question submission partially failed. ' + error);

            // revert the above operation.
          }
          resolve(question);
        });

        resolve(question);
      });
    });
  }

  // retrieves the questions which needs approval
  subscribePendingQuestions(channelId, onQuestionAdd) {

    // by default push the question to active channel
    channelId = channelId || this.activeChannelId;

    const onChildAdd = (snapshot) => {
      const question = snapshot.val();

      // filter the questions by pending-approval
      if (question && question.approvedBy === undefined) {
        onQuestionAdd(question);
      }
    };

    // questions list
    const channelQuestionsRef = this.refs.channelsRef.child(channelId).child('questions');

    // subscribe the questions list
    channelQuestionsRef.on('child_added', onChildAdd);

    // returns the detach callback to unSubscribe the list
    return () => {
      channelQuestionsRef.off('child_added', onChildAdd);
    }
  }

  // returns the channelId of active / last-selected channel
  getActiveChannelId() {
    return this.activeChannelId;
  }

  // sets the channelId once user joins successfully. to get channel profile later on channel page
  setActiveChannelId(channelId) {
    this.activeChannelId = channelId;
  }

  // returns channel profile against the given channelId
  getChannelProfile(channelId) {

    return new Promise((resolve, reject) => {

      this.refs.channelsRef.child(channelId).once('value', snapshot => {
        const channelProfile = snapshot.val();

        // if valid channelId then we get the channel profile
        if (channelProfile) {
          resolve(channelProfile);

        } else {
          console.log('getChannelProfile: error Invalid channelId - ');
          reject('Invalid channelId.');
        }
      }, (error) => {
        console.log('getChannelProfile: error - ', error);
        reject(error);
      });
    });
  }

  // returns the device id once retrieved already
  getDeviceId() {
    return location.hostname === 'localhost' ? this.getTestDeviceId() : this.uniqueDeviceID.get();
  }

  // returns test device-id for development purpose
  getTestDeviceId() {
    return new Promise(resolve => resolve('test-device-id'));
  }

  // returns the uuid - wait for the deviceId promise to be resolved first
  getUserProfile(uuid) {

    return new Promise((resolve, reject) => {

      this.refs.usersRef.child(uuid).once('value', snapshot => {
        resolve(snapshot.val());
      }, (error) => {
        reject(error);
      });
    });
  }

  // registers the user against the unique device-id
  registerUser(userName) {

    return new Promise((resolve, reject) => {
      let profile = {
        name: userName,
        since: Date.now()
      };

      this.refs.usersRef.child(this.deviceId).set(profile, error => {
        if (error) {
          console.log('registerUser: error - ', error);
          reject('User registration failed.');
        }
        resolve(userName);
      });
    });
  }

  // registers the user against the unique device-id
  getChannelCode(channelCode) {

    return new Promise((resolve, reject) => {

      this.refs.channelsCodeRef.child(channelCode).once('value', snapshot => {
        const channelId = snapshot.val();

        // if valid code then we get the channelId
        if (channelId) {
          resolve(channelId);

        } else {
          reject('Invalid channel code - please get one from the channel admin.');
        }
      }, (error) => {
        console.log('getChannelCode: error - ', error);
        reject(error);
      });
    });
  }

  // builds the references one-time only
  buildRefs () {
    console.log('buildRefs');

    const appDb = firebase.database();
    this.refs = {
      channelsCodeRef: appDb.ref('channels-codes'),
      channelsRef: appDb.ref('channels'),
      questionsRef: appDb.ref('questions'),
      commentsRef: appDb.ref('comments'),
      usersRef: appDb.ref('users')
    };

    // console.log('this.refs : ', this.refs);
  }
}
