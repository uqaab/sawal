import { Component } from '@angular/core';

/**
 * Generated class for the QueriesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'queries',
  templateUrl: 'queries.html'
})
export class QueriesComponent {

  text: string;

  constructor() {
    console.log('Hello QueriesComponent Component');
    this.text = 'Hello World';
  }

}
