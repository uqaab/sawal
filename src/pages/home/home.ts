import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  activeTab: string = "admin";
  isAndroid: boolean = false;

  constructor(
    public navCtrl: NavController,
    platform: Platform
  ) {
    this.isAndroid = platform.is('android');
  }


  // getToken () {
  //   this.firebase.getToken()
  //     .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
  //     .catch(error => console.error('Error getting token', error));
  // }
}
