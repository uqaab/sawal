import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AdminComponent } from 'components/admin/admin';
import { AskComponent } from 'components/ask/ask';
import { QueriesComponent } from 'components/queries/queries';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  activeTab: string = "admin";
  isAndroid: boolean = false;

  constructor(
    public navCtrl: NavController,
    platform: Platform,
    private uniqueDeviceID: UniqueDeviceID
  ) {
    this.isAndroid = platform.is('android');

    this.uniqueDeviceID.get()
      .then((uuid: any) => alert(uuid))
      .catch((error: any) => alert(error));
  }
}
