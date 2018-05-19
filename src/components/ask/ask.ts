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
  question: any = ''

  constructor() {
    console.log('Hello AskComponent Component');
    this.text = 'Hello World';
    this.question = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.'
  }


  submit () {
    console.log('submit');
  }
}
