import { Component, OnDestroy } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { FirebaseStoreProvider } from '../../providers/firebase-store/firebase-store';

@Component({
  selector: 'admin',
  templateUrl: 'admin.html'
})
export class AdminComponent implements OnDestroy {

  questions = [];
  unSubscribePendingQuestions: Function;

  constructor(private firebaseStore: FirebaseStoreProvider, public alertCtrl: AlertController) {
    console.log('Hello AdminComponent Component');
    this.fetchPendingQuestions();
  }

  // retrieves the count / length of the object
  getCount(list) {
    return Object.keys(list || {}).length;
  }

  fetchPendingQuestions() {
    const self = this;
    this.unSubscribePendingQuestions = this.firebaseStore.subscribePendingQuestions(null, (question) => {
      self.questions.push(question);
    });
  }

  ngOnDestroy () {
    console.log('admin: ngOnDestroy');
    this.unSubscribePendingQuestions();
  }

}
