declare var window;

//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

//import { Device } from '@ionic-native/device';
import { Keychain } from '@ionic-native/keychain';

@Injectable()
export class UtilProvider {
  userId: string;
  getDeviceIdPromise: Promise<any>;
  platformReadyPromise: Promise<any>;

  constructor(
    //private http: HttpClient,
    public platform: Platform,
    //private device: Device,
    private keychain: Keychain,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {

    // cache the ready event promise
    this.platformReadyPromise = this.platform.ready();
  }

  onPlatformReady(): Promise<any> {
    return this.platformReadyPromise;
  }

  public encryptString: (str:string) => string = (str) => {
    const mapping = {
      '-': 'a',
      '0': 'b',
      '1': 'c',
      '2': 'l',
      '3': 'm',
      '4': 'n',
      '5': 'p',
      '6': 'q',
      '7': 'r',
      '8': 'y',
      '9': 'z'
    };

    return str.split('').map(char => mapping[char] || char).join('');
  };

  // DEV only - returns test device-id for development purpose
  private getTestUserId: () => Promise<string> = () => {

    return Promise.resolve('test-device-id')
      .then((userId: string) => {
        // we can do any common manipulation with the test device id here.
        return userId;
      });
  };

  // get phone's actual device id
  private getPhoneDeviceId: () => Promise<any> = () => {

    console.log('getPhoneDeviceId. called');

    // check if already generated the userId
    if (this.getDeviceIdPromise) {
      console.log('cache getDeviceIdPromise found.');
      return this.getDeviceIdPromise;
    }

    console.log('this.device', window.device);

    // retrieve deviceId for android vs ios
    this.getDeviceIdPromise = this.onPlatformReady().then(() => {

      // if it is an android - cordova-plugin-device takes care of it.
      if (window.device) {
        const uuid = window.device.uuid;
        console.log('getPhoneDeviceId: android: uuid', uuid);

        let userId = uuid.substring(uuid.length - 16 - 1); // 16 IMEI plus 1 for "-"
        userId = this.encryptString(userId);

        console.log('getPhoneDeviceId - userId', userId);
        return userId;
      }

      console.log('getPhoneDeviceId: ios');

      // otherwise its ios - custom game

      const keyChainFieldName = 'SAWAL_USER_ID';
      return this.keychain.get(keyChainFieldName).then((uuid: string) => {

        // check if already previously stored custom UUID
        if (uuid) {
          console.log('getPhoneDeviceId: ios: uuid', uuid);
          return uuid;
        }

        // otherwise generate a new UUID and store it inside keychain.x
        const newCustomUUID: string = this.generateRandomKey();
        console.log('getPhoneDeviceId: ios: writing uuid', newCustomUUID);

        return this.keychain.set(keyChainFieldName, newCustomUUID, false)
          .then(() => {

            console.log('getPhoneDeviceId: ios: writing success uuid', newCustomUUID);
            return newCustomUUID;
          })
          .catch((err) => {

            console.log('getPhoneDeviceId: ios: writing failed uuid', newCustomUUID, err);
            return 'Failed in writing custom UUID to keychain.';
          });

      });
    });

    return this.getDeviceIdPromise
      .then(uuid => {
        return this.encryptString(uuid);
      });
  };

  // returns the device id once retrieved already
  getUserId() : Promise<string> {
    const promise = location.hostname === 'localhost' ? this.getTestUserId() : this.getPhoneDeviceId();

    // store the retrieved deviceId as userId
    return promise
      .then((deviceId: any) => {

        return this.userId = deviceId;
      });
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
  copyToClipboard = (textToCopy: string, alertMessage?: string) => {
    const elementId = 'sawal-temp-copy-element';

    let el:any = document.getElementById(elementId);

    // create element first time only
    if (!el) {
      el = document.createElement('textarea');        // Create a <textarea> element

      el.setAttribute('id', elementId);               // Make it readonly to be tamper-proof
      el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
      el.style.position = 'absolute';
      el.style.left = '-9999px';                      // Move outside the screen to make it invisible

      document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    }

    el.value = textToCopy;                          // Set its value to the string that you want copied

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

    // alert the copy task completion via toaster.
    this.showToast(alertMessage || 'Content Copied!');

  };

  // shows a black skinny toaster at bottom with the given message.
  showToast(alertMessage, closeButton?: boolean) {

    this.toastCtrl.create({
      message: alertMessage,
      duration: 1500,
      cssClass: 'text-center',
      showCloseButton: closeButton,
      position: 'bottom'
    }).present();
  }

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
