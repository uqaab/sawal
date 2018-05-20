import { Component, OnDestroy } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';

import * as moment from 'moment';

import { FirebaseStoreProvider } from '../../providers/firebase-store/firebase-store';
import { UtilProvider } from '../../providers/util/util';

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
    private utilService: UtilProvider,
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

  // filter questions with respect to active filter
  matchFilter = (question) => {
    return question.approvedBy === undefined;
  };

  // hides the loading popup, if not hided before.
  hideWaitScreen() {
    if (this.fetchingWait) {
      this.fetching = false;
      this.fetchingWait.dismiss();
      this.fetchingWait = null;
    }
  }

  // subscription - to be invoked on new question add
  questionsListOnAdd(question) {

    // skip if filter does not match the questions i.e. for type pending-approval
    if (!this.matchFilter(question)) {
      return;
    }

    this.questions.push(question);
    this.hideWaitScreen();
  }

  // subscription - to be invoked on existing question removed
  questionsListOnRemove(questionId) {

    // find the index of target question to be removed.
    const questionIndex = this.utilService.getIndexOf(this.questions, 'questionId', questionId);

    if (questionIndex) {
      this.questions.splice(questionIndex, 1);
    }
  }

  // sync with the pending questions all the time.
  fetchPendingQuestions() {
    const actions = {
      onAdd: (question) => this.questionsListOnAdd(question),
      onRemove: (questionId) => this.questionsListOnRemove(questionId)
    };

    this.unSubscribePendingQuestions = this.firebaseStore.subscribeChannelQuestions(null, actions, false);
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
