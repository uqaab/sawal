import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AlertController } from 'ionic-angular';
//import { Device } from '@ionic-native/device';

declare var window;

import * as firebase from 'firebase';

interface IRefs {
  channelsCodeRef?: any;
  channelsRef?: any;
  questionsRef?: any;
  commentsRef?: any;
  usersRef?: any;
}

export class FirebaseConfig {
  apiKey: string = 'AIzaSyBA1_7kjG2cYEyz2UAtHySoBtjR7a1Bm7E';
  authDomain: string = 'sawal-app-e2ef9.firebaseapp.com';
  databaseURL: string = 'https://sawal-app-e2ef9.firebaseio.com';
  projectId: string = 'sawal-app-e2ef9';
  storageBucket: string = '';
  messagingSenderId: string = '102631740478';
}

@Injectable()
export class FirebaseStoreProvider {
  refs: IRefs = {};
  firebaseConfig: FirebaseConfig;
  activeChannelId: string = '123123123';
  deviceId: string;
  getDeviceIdPromise: Promise<string>;
  constructor(
    public http: HttpClient,
    //private device: Device,
    public alertCtrl: AlertController
  ) {
    this.firebaseConfig = new FirebaseConfig();
  }

  // always be called whenever a question details in fetched and going to be used in the list.
  modifyQuestionModel = (question, questionId) => {
    question.questionId = questionId;

    // placeholders to be filled by their subscriber
    question.comments = [];
    question.votes = [];
    question.askedByName = '';

    return question;
  };

  public encryptString: (str:string) => string = (str) => {
    const mapping = {
      '-': 'a',
      0: 'b',
      1: 'c',
      2: 'l',
      3: 'm',
      4: 'n',
      5: 'p',
      6: 'q',
      7: 'r',
      8: 'y',
      9: 'z',
    };

    return str.split('').map(char => mapping[char] || char).join('');
  };

  // main initialization logic - one-time only
  public init () {

    // get device id to consider it as unique userID
    this.getDeviceId()
      .then((deviceId: string) => {

        // this.alertCtrl.create({
        //   title: 'Device ID',
        //   subTitle: 'Your device id is : ' + uuid,
        //   buttons: ['OK']
        // }).present();

        // init firebase SDK
        firebase.initializeApp(this.firebaseConfig);

        // build the required References
        this.buildRefs();

        return deviceId;
      })
      .catch((error: any) => {
        console.log('device-id - failed initializing app - could not read device-id', error);

        // inform user about the reason.
         this.alertCtrl.create({
           title: 'Error',
           subTitle: 'Could not read device-id. Try re-open or re-install the app and provide all the requested accesses.',
           buttons: ['OK']
         }).present();
      });
  }

  // DEV only - returns test device-id for development purpose
  private getTestDeviceId = () => {
    return Promise.resolve('test-device-id')
      .then((deviceId: string) => {
        return this.deviceId = deviceId;
      });
  };

  // get phone's actual device id
  private getPhoneDeviceId = () => {

    // check if already generated the deviceId
    if (this.getDeviceIdPromise) {
      return this.getDeviceIdPromise;
    }

    console.log('this.device', window.device);

    this.getDeviceIdPromise = Promise.resolve(window.device ? window.device.uuid : 'iphone-user-id')
      .then((uuid: any) => {
        console.log('getPhoneDeviceId - uuid', uuid);

        let userID = uuid.substring(uuid.length - 16 - 1); // 16 IMEI plus 1 for "-"
        userID = this.encryptString(userID);
        console.log('getPhoneDeviceId - userID', userID);

        return this.deviceId = userID;
      });

    return this.getDeviceIdPromise;
  };

  // returns the device id once retrieved already
  getDeviceId() {
    return location.hostname === 'localhost' ? this.getTestDeviceId() : this.getPhoneDeviceId();
  }

  // registers the user against the unique device-id
  submitQuestion(questionText, channelId?) {

    // by default push the question to active channel
    channelId = channelId || this.activeChannelId;

    return new Promise((resolve, reject) => {
      let question = {
        approvedBy: null,
        approvedOn: null,
        askedBy: this.deviceId,
        askedOn: Date.now(),
        comments: {},
        text: questionText,
        type: 0, // 0 for questions, 1 for poll, etc for later scaling.
        votes: {}
      };

      // add into questions namespace
      const questionId: string = this.refs.questionsRef.push().key;
      this.refs.questionsRef.child(questionId).set(question, error => {

        if (error) {
          console.log('submitQuestion: questions ref: error - ', error);
          reject('Question submission failed. ' + error);
        }

        // add question entry into channel's questions list.
        this.refs.channelsRef.child(channelId).child('questions').child(questionId).set(true, error => {
          if (error) {
            console.log('submitQuestion: channels ref: error - ', error);
            reject('Question submission partially failed. ' + error);

            // perhaps revert the above operation ?
          }
          resolve(question);
        });

        resolve(question);
      });
    });
  }

  // registers the user against the unique device-id
  submitComment(commentText, questionId) {

    return new Promise((resolve, reject) => {
      let comment = {
        text: commentText,
        commentedBy: this.deviceId,
        commentedOn: Date.now(),
      };

      // add comment entry into comments namespace
      const commentId: string = this.refs.commentsRef.push().key;
      this.refs.commentsRef.child(commentId).set(comment, error => {

        if (error) {
          console.log('submitComment: comments ref: error - ', error);
          reject('Comment submission failed. ' + error);
        }

        // add comment entry into question's comments list.
        this.refs.questionsRef.child(questionId)
          .child('comments').child(commentId)
          .set(true, error => {
            if (error) {
              console.log('submitComment: channels ref: error - ', error);
              reject('Comment submission partially failed. ' + error);

              // perhaps revert the above operation ?
            }

            resolve(comment);
          });
      });
    });
  }

  // retrieves the channel questions.
  subscribeChannelQuestions(channelId, actions) {

    // by default push the question to active channel
    channelId = channelId || this.activeChannelId;

    // when a new question gets added to the channel
    const onChannelQuestionAdd = (questionSnapshot) => {
      const questionId = questionSnapshot.key;
      this.getQuestionInfo(questionId)
        .then((question: any) => {
          actions.onAdd(question);

          // get the name of the user using the field askedBy
          this.getUserProfile(question.askedBy)
          .then((user: any) => {
            question.askedByName = user ? user.name : question.askedBy;
          })
          .catch(error => {
            console.log('onChannelQuestionAdd - could not get user name against askedBy field value.', error);
          });

        })
        .catch(error => {
          console.log('onChannelQuestionAdd: error - ', error);
        });
    };

    // when a question gets removed from the channel
    const onChannelQuestionRemove = (questionSnapshot) => {
      const questionId = questionSnapshot.key;
      actions.onRemove(questionId);
    };

    // questions list
    const channelQuestionsRef = this.refs.channelsRef.child(channelId).child('questions');

    // subscribe the questions list
    channelQuestionsRef.on('child_added', onChannelQuestionAdd);
    channelQuestionsRef.on('child_removed', onChannelQuestionRemove);

    // returns the detach callback to unSubscribe the list
    return () => {
      channelQuestionsRef.off('child_added', onChannelQuestionAdd);
      channelQuestionsRef.off('child_removed', onChannelQuestionRemove);
    }
  }

  // retrieves the questions comments.
  subscribeQuestionComments(questionId, actions) {

    // when a new comment gets added to the question
    const onQuestionCommentAdd = (commentSnapshot) => {
      const commentId = commentSnapshot.key;
      this.getCommentInfo(commentId)
        .then((comment: any) => {
          actions.onAdd(comment, questionId);

          // get the name of the user using the field commentedBy
          this.getUserProfile(comment.commentedBy)
            .then((user: any) => {
              comment.commentedByName = user ? user.name : comment.commentedBy;
            })
            .catch(error => {
              console.log('onChannelQuestionAdd - could not get user name against commentedBy field value.', error);
            });
        })
        .catch(error => {
          console.log('onQuestionCommentAdd: error - ', error);
        });
    };

    // when a comment gets removed from the question
    const onQuestionCommentRemove = (commentSnapshot) => {
      const commentId = commentSnapshot.key;
      actions.onRemove(commentId, questionId);
    };

    // comments list of the target question.
    const questionCommentsRef = this.refs.questionsRef.child(questionId).child('comments');

    // subscribe the comments list
    questionCommentsRef.on('child_added', onQuestionCommentAdd);
    questionCommentsRef.on('child_removed', onQuestionCommentRemove);

    // returns the detach callback to un subscribe the list
    return () => {
      questionCommentsRef.off('child_added', onQuestionCommentAdd);
      questionCommentsRef.off('child_removed', onQuestionCommentRemove);
    }
  }

  // retrieves the target question details
  getQuestionInfo(questionId) {

    return new Promise((resolve, reject) => {

      this.refs.questionsRef.child(questionId).once('value', (snapshot) => {
          const question = snapshot.val();
          if (question) {
            this.modifyQuestionModel(question, questionId);
            resolve(question);
          } else {
            console.log('getQuestionInfo: null - invalid questionId');
            reject('invalid questionId');
          }
        })
        .catch((error) => {
          // handle error here.
          reject(error);
        });
    });
  }

  // retrieves the target question details
  getCommentInfo(commentId) {

    return new Promise((resolve, reject) => {

      this.refs.commentsRef.child(commentId).once('value', (snapshot) => {
          const comment = snapshot.val();
          comment.commentId = snapshot.key;

          if (comment) {
            resolve(comment);
          } else {
            console.log('getCommentInfo: null - invalid commentId');
            reject('invalid commentId');
          }
        })
        .catch((error) => {
          // handle error here.
          reject(error);
        });
    });
  }

  // monitor question approval change to add to list. i.e. from pending-approval to approved.
  channelQuestionOnApprove(questionId) {

    let subscriber: any = {};
    const questionRef = this.refs.questionsRef.child(questionId);

    subscriber.promise = new Promise( (resolve, reject) => {

      // dispatcher to call when question has approved, or view has destroyed
      subscriber.dispatcher = () => {
        questionRef.off('value', onQuestionUpdate);
      };

      const onQuestionUpdate = (questionSnapshot) => {
        const question = questionSnapshot.val();

        // get approved question details to add to the list.
        if (question && question.approvedBy) {
          this.modifyQuestionModel(question, questionId);
          resolve(question);
        }
      };

      // register the "on" event of live sync
      questionRef.on('value', onQuestionUpdate);
    });

    return subscriber;
  }

  // marks the question as approved, so that it could be added to the list
  approvePendingQuestion(questionId) {

    return new Promise((resolve, reject) => {

      // set approvedOn info
      this.refs.questionsRef.child(questionId).child('approvedOn').set(Date.now(), error => {
        const errorMessage = 'Question approval failed.';

        if (error) {
          console.log('approvePendingQuestion: approvedOn error - ', error);
          reject(errorMessage);
        }

        // set approvedBy info.
        this.refs.questionsRef.child(questionId).child('approvedBy').set(this.deviceId, error => {

          if (error) {
            console.log('approvePendingQuestion: approvedBy error - ', error);
            reject(errorMessage);
          }

          // consider the task resolved.
          resolve();
        });
      });
    });
  }

  // removes the selected question from the channels list and questions list as well.
  removeQuestion(questionId, channelId?) {

    // by default push the question to active channel
    channelId = channelId || this.activeChannelId;

    // remove the entry from channel's questions list
    return this.refs.channelsRef.child(channelId)
      .child('questions').child(questionId)
      .remove()
      .then(()=> {

        // remove the entry from questions list
        return this.refs.questionsRef.child(questionId).remove()
      });
  }

  // removes the selected comment from the questions list.
  removeComment(questionId, commentId) {

    // remove the entry from question's comments list
    return this.refs.questionsRef.child(questionId)
      .child('comments').child(commentId)
      .remove()
      .then(()=> {

        // remove the comment from comments list
        return this.refs.commentsRef.child(commentId).remove()
      });
  }

  // submit a vote-up for the selected question
  questionVoteUp(questionId) {

    return new Promise((resolve, reject) => {

      this.refs.questionsRef.child(questionId).child('votes').child(this.deviceId).set(Date.now(), error => {

        if (error) {
          console.log('submitQuestionVote: error - ', error);
          reject('Vote Up submission failed');
        }

        resolve('Successfully voted for the question.');
      });
    });
  }

  // remove the vote-up of the selected question
  questionVoteRemove(questionId) {

    // remove the entry from question votes list
    return this.refs.questionsRef.child(questionId)
      .child('votes').child(this.deviceId)
      .remove();
  }

  // retrieves the questions comments.
  subscribeQuestionVotes(questionId, actions) {

    // when a new vote gets added to the question
    const onQuestionVoteAdd = (voteSnapshot) => {
      const voteInfo = {
        votedBy: voteSnapshot.key,
        votedOn: voteSnapshot.val(),
        votedByName: undefined
      };

      actions.onAdd(voteInfo, questionId);

      // get the name of the user using the field votedBy
      this.getUserProfile(voteInfo.votedBy)
        .then((user: any) => {
          voteInfo.votedByName = user ? user.name : voteInfo.votedBy;
        })
        .catch(error => {
          console.log('onQuestionVoteAdd - could not get user name against votedBy field value.', error);
        });
    };

    // when a vote gets removed from the question
    const onQuestionVoteRemove = (voteSnapshot) => {
      const voteId = voteSnapshot.key;
      actions.onRemove(voteId, questionId);
    };

    // votes list of the target question.
    const questionVotesRef = this.refs.questionsRef.child(questionId).child('votes');

    // subscribe the votes list
    questionVotesRef.on('child_added', onQuestionVoteAdd);
    questionVotesRef.on('child_removed', onQuestionVoteRemove);

    // returns the detach callback to un subscribe the list
    return () => {
      questionVotesRef.off('child_added', onQuestionVoteAdd);
      questionVotesRef.off('child_removed', onQuestionVoteRemove);
    }
  }

  // retrieves the questions which needs approval
  hasQuestions(filter: Function, channelId?: string) {

    return new Promise((mainResolve, mainReject) => {

      // by default push the question to active channel
      channelId = channelId || this.activeChannelId;
      const promises = [];

      // read whole list of questions of the channel
      this.refs.channelsRef.child(channelId).child('questions').once('value', snapshot => {
        const questions = snapshot.val();

        // when channel has no questions at all. (of all types) - no pending or approved questions.
        if (!questions) {
          mainResolve(false);
          return;
        }

        // check question details
        const checkForPending = (questionId) => {

          let promise = new Promise((resolve) => {
            this.refs.questionsRef.child(questionId).once('value', (questionInfoSnapshot) => {
              const question = questionInfoSnapshot.val();
              const matchFilter = filter(question);

              // if found one, skip waiting for others
              if (matchFilter) {
                mainResolve(true);
              }

              resolve(matchFilter);
            });
          });

          promises.push(promise);
        };

        // iterate over each question to fetch its details
        for (let questionId in questions) {
          checkForPending(questionId);
        }

        // when all promise resolves, stop waiting for miracle, and consider there is no pending question.
        Promise.all(promises)
          .then(results => {
            mainResolve(false);
          })
          .catch(error => {
            console.log('hasPendingQuestions: all catch', channelId, error);
            // handle this case.
            mainReject(error);
          });

      }, (error) => {
        console.log('hasPendingQuestions: error - ', error);
        mainReject(error);
      });
    });
  }

  // returns the channelId of active / last-selected channel
  getActiveChannelId() {
    return this.activeChannelId;
  }

  // sets the channelId once user joins successfully. to get channel profile later on channel page
  setActiveChannelId(channelId) {
    this.activeChannelId = channelId;
  }

  // returns channel profile against the given channelId
  getChannelProfile(channelId) {

    return new Promise((resolve, reject) => {

      this.refs.channelsRef.child(channelId).once('value', snapshot => {
        const channelProfile = snapshot.val();

        // if valid channelId then we get the channel profile
        if (channelProfile) {
          resolve(channelProfile);

        } else {
          console.log('getChannelProfile: error Invalid channelId - ');
          reject('Invalid channelId.');
        }
      }, (error) => {
        console.log('getChannelProfile: error - ', error);
        reject(error);
      });
    });
  }

  // returns the uuid - wait for the deviceId promise to be resolved first
  getUserProfile(uuid) {

    return new Promise((resolve, reject) => {

      this.refs.usersRef.child(uuid).once('value', snapshot => {
        resolve(snapshot.val());
      }, (error) => {
        reject(error);
      });
    });
  }

  // registers the user against the unique device-id
  registerUser(userName) {

    return new Promise((resolve, reject) => {
      let profile = {
        name: userName,
        since: Date.now()
      };

      this.refs.usersRef.child(this.deviceId).set(profile, error => {
        if (error) {
          console.log('registerUser: error - ', error);
          reject('User registration failed.');
        }
        resolve(userName);
      });
    });
  }

  // registers the user against the unique device-id
  validateChannelCodes(payload) {

    return new Promise((resolve, reject) => {

      this.refs.channelsCodeRef.child(payload.channelCode).once('value', snapshot => {
        const channelId = snapshot.val();

        // if valid code then we get the channelId
        if (channelId) {

          // check if admin access is requested
          if (payload.accessType === 'admin') {

            this.refs.channelsRef.child(channelId).once('value', snapshot => {
              const channelProfile = snapshot.val();

              // check if admin PIN matches
              if (channelProfile.adminPIN === payload.adminPIN) {
                resolve(channelId);

              } else {
                reject('Invalid Admin PIN - please get one from the channel admin.');
              }
            });

          } else {
            resolve(channelId);
          }
        } else {
          reject('Invalid channel code - please get one from the channel admin.');
        }
      }, (error) => {
        console.log('getChannelCode: error - ', error);
        reject(error);
      });
    });
  }

  // builds the references one-time only
  buildRefs () {
    const appDb = firebase.database();

    this.refs = {
      channelsCodeRef: appDb.ref('channels-codes'),
      channelsRef: appDb.ref('channels'),
      questionsRef: appDb.ref('questions'),
      commentsRef: appDb.ref('comments'),
      usersRef: appDb.ref('users')
    };
  }
}
