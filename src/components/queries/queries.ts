import { Component } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';

import * as moment from 'moment';

@Component({
  selector: 'queries',
  templateUrl: 'queries.html'
})
export class QueriesComponent {
  toggleAnswer: any = {};
  questionsList: any = [];

  constructor(private alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.questionsList = this.getQuesionList();
    this.startLoading();
  }

  startLoading () {
    let loading = this.loadingCtrl.create({
      content: 'Loading Questions...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 1000);
  }

  //get list of Farms.
  getQuesionList () {
    let questionsList = [];

    // TODO this is going to be async via firebase
    let questions = {
      "23412341234" : {
        "approvedBy" : 123123123,
        "approvedOn" : 123234234,
        "askedBy" : 123123123,
        "askedOn" : 12312312312,
        "text" : "Nawafil bataeye kch Tak rat k lye.",
        "votes" : {
          "1312312" : 123123123,
          "1312313" : 312312312,
          "1312314" : 123123123
        },
        "comments" : {
          "1312312" : true
        }
      },
      "23412341235" : {
        "approvedBy" : 123123123,
        "approvedOn" : 123234234,
        "askedBy" : 123123123,
        "askedOn" : 12312312312,
        "text" : "Wuzu k faraez kia hyn ?",
        "votes" : {
          "1312312" : true
        },
        "comments" : {
          "1312312" : true,
          "1312313" : true,
          "1312314" : true
        }
      }
    };

    // covert object into array
    for (const questionId in questions) {
      questions[questionId].questionId = questionId;
      questionsList.push(questions[questionId]);
    }

    return questionsList;
  }

  // retrieves the count / length of the object
  getCount(list) {
    return Object.keys(list || {}).length;
  }

  removeQuestionConfirmation (isQuestion: boolean) {
    this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
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


}
