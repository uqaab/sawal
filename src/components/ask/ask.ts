import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { FirebaseStoreProvider } from '../../providers/firebase-store/firebase-store';
import { UtilProvider } from '../../providers/util/util';

@Component({
  selector: 'ask',
  templateUrl: 'ask.html'
})
export class AskComponent {
  submitting: boolean = false;
  questionText: any = '';
  //questionText: any = 'test question 00 - ' + Date.now();

  constructor(
    private firebaseStore: FirebaseStoreProvider,
    private utilService: UtilProvider,
    public alertCtrl: AlertController) {
    //console.log('Hello AskComponent Component');
  }

  // submits the question against the selected channel
  submit () {
    const self = this;

    // payload validation
    if (!this.questionText || this.questionText.length < 10) {

      this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Question text can be minimum 10 characters and maximum 300 characters.',
        buttons: ['Try Again']
      }).present();

      return;
    }

    self.submitting = true;
    this.firebaseStore.submitQuestion(this.questionText)
      .then(() => {

        self.submitting = false;
        self.questionText = '';
        this.utilService.showToast('Question submitted successfully !');
      })
      .catch(error => {

        self.submitting = false;
        this.utilService.showToast(error, true);
      });

  }
}
