import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { FirebaseStoreProvider } from '../../providers/firebase-store/firebase-store';

@Component({
  selector: 'ask',
  templateUrl: 'ask.html'
})
export class AskComponent {

  text: string;
  submitting: boolean = false;
  questionText: any = '';

  constructor(private firebaseStore: FirebaseStoreProvider, public alertCtrl: AlertController) {
    console.log('Hello AskComponent Component');
  }

  // submits the question against the selected channel
  submit () {
    console.log('submit');
    const self = this;

    // payload validation
    if (!this.questionText || this.questionText.length > 300 || this.questionText.length < 10) {

      this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Question text characters limit is <br> min = 10, and max = 300.',
        buttons: ['Try Again']
      }).present();

      return;
    }

    self.submitting = true;
    this.firebaseStore.submitQuestion(this.questionText)
      .then(() => {
        self.submitting = false;
        self.questionText = '';

        this.alertCtrl.create({
          title: 'Successful !',
          subTitle: 'Your question has been submitted successfully. It will be published once Admin approves it.',
          buttons: ['OK']
        }).present();

      })
      .catch(error => {
        self.submitting = false;

        this.alertCtrl.create({
          title: 'Error',
          subTitle: error,
          buttons: ['OK']
        }).present();
      });

  }
}
