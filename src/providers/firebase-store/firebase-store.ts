import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
/*
  Generated class for the FirebaseStoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseStoreProvider {

  refs: object = {};
  config = {
    apiKey: "AIzaSyBA1_7kjG2cYEyz2UAtHySoBtjR7a1Bm7E",
    authDomain: "sawal-app-e2ef9.firebaseapp.com",
    databaseURL: "https://sawal-app-e2ef9.firebaseio.com",
    projectId: "sawal-app-e2ef9",
    storageBucket: "",
    messagingSenderId: "102631740478"
  };

  constructor(public http: HttpClient) {
    console.log('FirebaseStoreProvider');
  }

  // main initialization logic - one-time only
  init () {

    // init firebase SDK
    firebase.initializeApp(this.config);

    // build the required References
    this.sefRefs();
  }

  // returns the references to be consumed across app
  getRefs () {
    return this.refs;
  }

  // builds the references one-time only
  sefRefs () {
    const appDb = firebase.database();

    this.refs.channelsCodeRef = appDb.ref('channels-codes');
    this.refs.channelsRef = appDb.ref('channels');

    this.refs.questionsRef = appDb.ref('questions');
    this.refs.commentsRef = appDb.ref('comments');

    this.refs.usersRef = appDb.ref('users');
  }
}
