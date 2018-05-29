import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AlertController } from 'ionic-angular';

@Injectable()
export class UtilProvider {

  constructor(
    public http: HttpClient,
    public alertCtrl: AlertController
  ) {

  }

  getIndexOf = (items, propName, propValue) => {

    for (var i = 0; i < items.length; i++) {

      if (items[i][propName] === propValue) {
        return i;
      }
    }
  };

  // generates a random key string of length 25, 26.
  generateRandomKey: () => string = () => {
    let date = new Date();
    let components = [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ];

    // 25  - 21 digits UUID
    return components.join('') + Math.random().toString().substr(2, 10);
  };

  // confirm modal for remove question, or answer.
  confirmRemove() {
    return new Promise((resolve, reject) => {
      this.alertCtrl.create({
        title: 'Confirm',
        message: 'Are you sure, you want to delete?',
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: reject
        }, {
          text: 'Delete',
          handler: resolve
        }]
      }).present();
    });
  }
}
