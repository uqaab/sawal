import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { FirebaseStoreProvider } from '../../providers/firebase-store/firebase-store';

@Component({
  selector: 'ask',
  templateUrl: 'ask.html'
})
export class AskComponent {
  submitting: boolean = false;
  questionText: any = '';
  //questionText: any = 'test question 00 - ' + Date.now();

  constructor(private firebaseStore: FirebaseStoreProvider, public alertCtrl: AlertController) {
    //console.log('Hello AskComponent Component');
  }

  // submits the question against the selected channel
  submit () {
    const self = this;

    // payload validation
    if (!this.questionText || this.questionText.length > 300 || this.questionText.length < 10) {

      this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Question text can be minimum 10 characters and maximum 5000 characters.',
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
          subTitle: 'Your question has been submitted successfully.',
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
