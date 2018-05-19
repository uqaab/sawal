import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import * as firebase from 'firebase';

/**
 * Generated class for the ChannelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
})
export class ChannelPage {

  // activeTab: string = "admin";
  // activeTab: string = "queries";
  activeTab: string = "ask";
  isAndroid: boolean = false;

  constructor(
    public navCtrl: NavController,
    platform: Platform
  ) {
    this.isAndroid = platform.is('android');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChannelPage');
  }

}
