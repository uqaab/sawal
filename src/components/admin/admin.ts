import { Component } from '@angular/core';

/**
 * Generated class for the AdminComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'admin',
  templateUrl: 'admin.html'
})
export class AdminComponent {

  text: string;
  questionsList = [];

  constructor() {
    console.log('Hello AdminComponent Component');
    this.text = 'Hello World';
    this.questionsList = this.getQuesionList();
  }


  //get list of Farms.
  getQuesionList () {
    let questions = [
      {question:'what are the pilars of Islam?'},
      {question:'what are the pilars of Islam?'},
      {question:'what are the pilars of Islam?'},
      {question:'what are the pilars of Islam?'},
      {question:'what are the pilars of Islam?'},
      {question:'what are the pilars of Islam?'},
    ];
    return questions;
  }

}
