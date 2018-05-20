import { Component, OnDestroy } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';

import * as moment from 'moment';

import { FirebaseStoreProvider } from '../../providers/firebase-store/firebase-store';
import { UtilProvider } from '../../providers/util/util';

@Component({
  selector: 'queries',
  templateUrl: 'queries.html'
})
export class QueriesComponent implements OnDestroy {
  toggleAnswer: any = {};
  fetching: boolean = false;
  fetchingError: string;
  waitState: any;
  questions = [];
  unSubscribeQuestionsList: Function;

  constructor( private firebaseStore: FirebaseStoreProvider,
               private utilService: UtilProvider,
               public alertCtrl: AlertController,
               public loadingCtrl: LoadingController
  ) {
    this.checkApprovedQuestionsList();
    this.fetchPendingQuestions();
  }

  // retrieves the count / length of the object
  getCount = (list) => {
    return Object.keys(list || {}).length;
  };

  formatDate = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  // filter questions with respect to active filter
  matchFilter = (question) => {
    return question && question.approvedBy;
  };

  // hides the loading popup, if not hided before.
  hideWaitScreen() {
    if (this.waitState) {
      this.fetching = false;
      this.waitState.dismiss();
      this.waitState = null;
    }
  }

  // checks if there is any approved question or empty list.
  checkApprovedQuestionsList() {
    this.fetching = true;
    this.waitState = this.loadingCtrl.create({
      content: 'Loading list...'
    });

    this.waitState.present();
    this.firebaseStore.hasQuestions(this.matchFilter, null)
      .then(hasApprovedQuestion => {
        //console.log('checkApprovedQuestionsList:', hasPendingItem);

        // if no pending questions, then show inform user.
        if (!hasApprovedQuestion) {
          this.hideWaitScreen();
          //return;
        }

        // otherwise - wait for the fetchApprovedQuestions() to hide the fetching.
      })
      .catch(error => {
        this.fetching = false;
        this.fetchingError = error;
      });
  }

  // subscription - to be invoked on new question added
  questionsListOnAdd(question) {

    // if not approved yet, monitor the approval.
    if (!this.matchFilter(question)) {

      this.firebaseStore.channelQuestionOnApprove(question.questionId)
        .then(() => {
          this.questionsListOnAdd(question);
        })
        .catch((error) => {
          console.log('questionsListOnAdd: monitor approval failed', error);
        });

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

    // subscribe and keep the dispatcher
    this.unSubscribeQuestionsList = this.firebaseStore.subscribeChannelQuestions(null, actions);
  }

  removeQuestionConfirmation (isQuestion: boolean) {
    this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Are you sure you want to delete ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Delete clicked');

            //Call APIs based on conditions for delete question or answer.
            isQuestion ? this.removeQuestion() : this.removeAnswer();
          }
        }
      ]
    }).present();
  }

  removeQuestion () {
    console.log('removeQuestion');
    // todo: send delete question api call
  }

  removeAnswer () {
    console.log('removeAnswer');
    // todo: send delete answer api call
  }

  // to be invoked when view is about to be destroyed.
  ngOnDestroy() {
    this.unSubscribeQuestionsList();
  }

}
