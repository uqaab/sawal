import { Component, OnDestroy } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { FirebaseStoreProvider } from '../../providers/firebase-store/firebase-store';

@Component({
  selector: 'admin',
  templateUrl: 'admin.html'
})
export class AdminComponent implements OnDestroy {

  fetching: boolean = false;
  fetchingError: string;
  questions = [];
  unSubscribePendingQuestions: Function;

  constructor(private firebaseStore: FirebaseStoreProvider, public alertCtrl: AlertController) {
    this.checkPendingQuestionsList();
    this.fetchPendingQuestions();
  }

  // retrieves the count / length of the object
  getCount(list) {
    return Object.keys(list || {}).length;
  }

  // checks if there is any pending question or empty list.
  checkPendingQuestionsList() {
    this.fetching = true;
    this.firebaseStore.hasPendingQuestions()
      .then(hasPendingItem => {
        //console.log('checkPendingQuestionsList:', hasPendingItem);

        // if no pending questions, then show inform user.
        if (!hasPendingItem) {
          this.fetching = false;
          //return;
        }

        // otherwise - wait for the fetchPendingQuestions() to hide the fetching.
      })
      .catch(error => {
        this.fetching = false;
        this.fetchingError = error;
      });
  }

  // sync with the pending questions all the time.
  fetchPendingQuestions() {
    const self = this;
    this.unSubscribePendingQuestions = this.firebaseStore.subscribePendingQuestions(null, (question) => {
      //console.log('fetchPendingQuestions:', question);
      self.questions.push(question);

      // hide wait screen if left activated
      this.fetching = false;
    });
  }

  ngOnDestroy () {
    this.unSubscribePendingQuestions();
  }

}
