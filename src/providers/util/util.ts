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

  // taken from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
  copyToClipboard = (textToCopy: string) => {
    const elementId = 'sawal-temp-copy-element';

    let el:any = document.getElementById(elementId);

    // create element first time only
    if (!el) {
      el = document.createElement('textarea');        // Create a <textarea> element

      el.value = textToCopy;                          // Set its value to the string that you want copied
      el.setAttribute('id', elementId);               // Make it readonly to be tamper-proof
      el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
      el.style.position = 'absolute';
      el.style.left = '-9999px';                      // Move outside the screen to make it invisible

      document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    }

    const selected =
      document.getSelection().rangeCount > 0        // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0)     // Store selection if found
        : undefined;                                // Mark as undefined to know no selection existed before

    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    //document.body.removeChild(el);                  // Remove the <textarea> element

    if (selected) {                                 // If a selection existed before copying
      document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
      document.getSelection().addRange(selected);   // Restore the original selection
    }
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
