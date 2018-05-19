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
  questionsList: any = [];

  constructor() {
    console.log('Hello QueriesComponent Component');
    this.text = 'Hello World';
    this.questionsList = this.getQuesionList();
  }

  //get list of Farms.
  getQuesionList () {
    let questionsList = [];

    // TODO this is going to be async via firebase
    let questions = {
      "23412341234" : {
        "approvedBy" : 123123123,
        "approvedOn" : 123234234,
        "askedBy" : 123123123,
        "askedOn" : 12312312312,
        "text" : "this is the first question",
        "votes" : {
          "1312312" : 123123123,
          "1312313" : 312312312,
          "1312314" : 123123123
        },
        "comments" : {
          "1312312" : true
        }
      },
      "23412341235" : {
        "approvedBy" : 123123123,
        "approvedOn" : 123234234,
        "askedBy" : 123123123,
        "askedOn" : 12312312312,
        "text" : "this is the second question",
        "votes" : {
          "1312312" : true
        },
        "comments" : {
          "1312312" : true,
          "1312313" : true,
          "1312314" : true
        }
      }
    };

    // covert object into array
    for (const questionId in questions) {
      questions[questionId].questionId = questionId;
      questionsList.push(questions[questionId]);
    }

    return questionsList;
  }

  // retrieves the count / length of the object
  getCount(list) {
    return Object.keys(list || {}).length;
  }

}
