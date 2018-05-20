import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the UtilProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilProvider {

  constructor(public http: HttpClient) {

  }

  getIndexOf = (items, propName, propValue) => {

    for (var i = 0; i < items.length; i++) {

      if (items[i][propName] === propValue) {
        return i;
      }
    }
  }
}
