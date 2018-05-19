import { Component } from '@angular/core';

/**
 * Generated class for the AskComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ask',
  templateUrl: 'ask.html'
})
export class AskComponent {

  text: string;

  constructor() {
    console.log('Hello AskComponent Component');
    this.text = 'Hello World';
  }

}
