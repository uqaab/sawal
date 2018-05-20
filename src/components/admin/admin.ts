import { Component, OnDestroy } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';

import * as moment from 'moment';

import { FirebaseStoreProvider } from '../../providers/firebase-store/firebase-store';

@Component({
  selector: 'admin',
  templateUrl: 'admin.html'
})
export class AdminComponent implements OnDestroy {

  fetching: boolean = false;
  fetchingError: string;
  fetchingWait: any;
  questions = [];
  unSubscribePendingQuestions: Function;

  constructor(
    private firebaseStore: FirebaseStoreProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    this.checkPendingQuestionsList();
    this.fetchPendingQuestions();
  }

  formatDate(timestamp) {
    return moment(timestamp).fromNow();
  }

  // checks if there is any pending question or empty list.
  checkPendingQuestionsList() {
    this.fetching = true;
    this.fetchingWait = this.loadingCtrl.create({
      content: 'Loading list...'
    });

    this.fetchingWait.present();
    this.firebaseStore.hasPendingQuestions()
      .then(hasPendingItem => {
        //console.log('checkPendingQuestionsList:', hasPendingItem);

        // if no pending questions, then show inform user.
        if (!hasPendingItem) {
          this.fetching = false;
          this.fetchingWait.dismiss();
          this.fetchingWait = null;
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
      if (this.fetchingWait) {
        this.fetching = false;
        this.fetchingWait.dismiss();
        this.fetchingWait = null;
      }
    });
  }

  // marks the question as approved, so that it could be added to the list
  approvePendingQuestion(question, index) {
    const wait = this.loadingCtrl.create({
      content: 'Please give us a moment...'
    });

    wait.present();
    this.firebaseStore.approvePendingQuestion(question.questionId)
      .then(() => {
        //console.log('approvePendingQuestion: success');
        wait.dismiss();

        // remove the entry from the list
        this.questions.splice(index, 1);
      })
      .catch(error => {

        this.alertCtrl.create({
          title: 'Error',
          subTitle: error,
          buttons: ['OK']
        }).present();
      });
  }

  // asks user to confirm, then it removes the selected question.
  removePendingQuestion(question, index) {

    // ask for confirmation first
    this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Are you sure you want to delete ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.removePendingQuestionConfirm(question, index);
          }
        }
      ]
    }).present();
  }

  // removes the selected question from the channels list and questions list as well.
  removePendingQuestionConfirm(question, index) {
    const wait = this.loadingCtrl.create({
      content: 'Please give us a moment...'
    });

    wait.present();
    this.firebaseStore.removePendingQuestion(question.questionId)
      .then(() => {
        //console.log('approvePendingQuestion: success');
        wait.dismiss();

        // remove the entry from the list
        this.questions.splice(index, 1);
      })
      .catch(error => {

        this.alertCtrl.create({
          title: 'Error',
          subTitle: error,
          buttons: ['OK']
        }).present();
      });
  }

  ngOnDestroy () {
    this.unSubscribePendingQuestions();
  }

}
