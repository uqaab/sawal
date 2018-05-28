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
  waitState: any;
  questions = [];
  unSubscribeQuestionsList: Function;
  dispatchers: any = {};

  constructor(
    private firebaseStore: FirebaseStoreProvider,
    private utilService: UtilProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    this.checkPendingQuestionsList();
    this.fetchPendingQuestions();
  }

  formatDate = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  // filter questions with respect to active filter
  matchFilter = (question) => {
    return question && question.approvedBy === undefined;
  };

  // hides the loading popup, if not hided before.
  hideWaitScreen() {
    if (this.waitState) {
      this.fetching = false;
      this.waitState.dismiss();
      this.waitState = null;
    }
  }

  // sorts the questions list according to timestamp
  sortQuestions() {
    this.questions.sort((a, b) => b['askedOn'] - a['askedOn']);
  }

  // checks if there is any pending question or empty list.
  checkPendingQuestionsList() {
    this.fetching = true;
    this.waitState = this.loadingCtrl.create({
      content: 'Loading list...'
    });

    this.waitState.present();
    this.firebaseStore.hasQuestions(this.matchFilter, null)
      .then(hasPendingQuestion => {
        //console.log('checkPendingQuestionsList:', hasPendingItem);

        // if no pending questions, then inform user.
        if (!hasPendingQuestion) {
          this.hideWaitScreen();
          //return;
        }

        // otherwise - wait for the fetchPendingQuestions() to hide the fetching.
      })
      .catch(error => {
        this.fetching = false;
        this.fetchingError = error;
      });
  }

  // subscription - to be invoked on new question added
  questionsListOnAdd(question) {

    // skip if filter does not match the questions i.e. for type pending-approval
    if (!this.matchFilter(question)) {
      return;
    }

    this.questions.push(question);
    this.sortQuestions();
    this.hideWaitScreen();

    // Subscribe to the approval changes (when other admin approves and so updates the question pending state)
    const subscriber = this.firebaseStore.channelQuestionOnApprove(question.questionId);

    // add dispatcher for onDestroy removal
    this.dispatchers[question.questionId] = subscriber.dispatcher;

    subscriber.promise
      .then((approvedQuestion) => {

        // question has been approved now - remove from the list
        this.questionsListOnRemove(approvedQuestion.questionId);

        // call dispatcher
        subscriber.dispatcher();

        // remove dispatcher from dispatchers list to avoid duplicate calls
        delete this.dispatchers[question.questionId];
      })
      .catch((error) => {
        console.log('questionsListOnAdd: monitor approval failed', error);
      });
  }

  // subscription - to be invoked on existing question removed
  questionsListOnRemove(questionId) {

    // find the index of target question to be removed.
    const questionIndex = this.utilService.getIndexOf(this.questions, 'questionId', questionId);

    if (questionIndex !== undefined) {
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

  // marks the question as approved, so that it could be added to the list
  approvePendingQuestion(questionId) {
    const wait = this.loadingCtrl.create({
      content: 'Please give us a moment...'
    });

    wait.present();
    this.firebaseStore.approvePendingQuestion(questionId)
      .then(() => {
        // question removal from local array list is done via fetchPendingQuestions()
        wait.dismiss();
      })
      .catch(error => {

        this.alertCtrl.create({
          title: 'Error',
          subTitle: error,
          buttons: ['OK']
        }).present();
      });
  }

  // removes the selected question from the channels list and questions list as well.
  removePendingQuestion(questionId) {

    // ask for confirmation first.
    this.utilService.confirmRemove()
      .then(() => {

        const wait = this.loadingCtrl.create({
          content: 'Please give us a moment...'
        });

        wait.present();
        this.firebaseStore.removeQuestion(questionId)
          .then(() => {
            // question removal from local array list is done via fetchPendingQuestions()
            wait.dismiss();
          })
          .catch(error => {
            wait.dismiss();

            this.alertCtrl.create({
              title: 'Error',
              subTitle: error,
              buttons: ['OK']
            }).present();
          });
      })
      .catch((error) => {
        // handle error here.
      });
  }

  // to be invoked when view is about to be destroyed.
  ngOnDestroy() {
    this.unSubscribeQuestionsList();

    // clear listeners for questions pending approval state
    for (let questionId in this.dispatchers) {
      this.dispatchers[questionId]();
    }
  }

}
