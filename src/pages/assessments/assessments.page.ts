import { Component, ViewChild } from '@angular/core';
import {
  NavParams,
  NavController,
  AlertController,
  Navbar,
  LoadingController
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { CacheService } from '../../shared/cache/cache.service';
import { AssessmentService } from '../../services/assessment.service';
import { SubmissionService } from '../../services/submission.service';

import { AssessmentsGroupPage } from './group/assessments-group.page'

import * as _ from 'lodash';

class ActivityBase {
  id: number;
  name: string;
  description: string;
}

class ReferenceAssessmentBase {
  id: number;
  name: string;
}

class ReferenceBase {
  context_id: number;
  Assessment: ReferenceAssessmentBase
}

@Component({
  selector: 'assessments-page',
  templateUrl: './assessments.html'
})
export class AssessmentsPage {
  @ViewChild(Navbar) navbar: Navbar;

  activity: any = {};
  answers: any = {};

  assessment: any = {};
  assessmentGroups: any = [];
  assessmentQuestions: any = [];
  allowSubmit: any = true;

  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private cache: CacheService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private assessmentService: AssessmentService,
    private submissionService: SubmissionService
  ) {
    this.activity = this.navParams.get('activity');
    if (!this.activity) {
      throw "Fatal Error: Activity not available";
    }

    this.activity = this.normaliseActivity(this.activity);
    console.log('this.activity', this.activity);
  }

  ionViewDidLoad() {
    // Custom back button on page
    this.navbar.backButtonClick = (e: UIEvent) => {
      this.clickDiscard();
    }
  }

  /*
  Turn Activity object from:
    {
      "Activity": {
        "id": 14,
        "name": "Warm-up Round",
        "description": "...",
        ...
      },
      "ActivitySequence": [
        ...
      ],
      "References": [
        {
          "context_id": 1,
          "Assessment": {
            "id": 31,
            "name": "Checkin Assessment"
          }
        },
        ...
      ]
    }
  */
  normaliseActivity = (activity) => {
    let normalisedActivity: ActivityBase = {
      id: activity.Activity.id,
      name: activity.Activity.name,
      description: activity.Activity.description
    }

    activity.Activity = normalisedActivity;

    // Normalise activity reference
    activity.References.forEach((reference, idx) => {
      let referenceAssessment: ReferenceAssessmentBase = {
        id: reference.Assessment.id,
        name: reference.Assessment.name,
      }
      let normalisedReference: ReferenceBase = {
        context_id: reference.context_id,
        Assessment: referenceAssessment
      };
      activity.References[idx] = normalisedReference;
    });

    return activity;
  };

  /**
   * @description mapping assessments and submissions
   * @param {Object} assessments assessments
   * @param {Object} submissions submissions
   */
  mapAssessmentsAndSubmissions(assessments, allSubmissions) {
    _.forEach(assessments, (group, i) => {
      _.forEach(group, (assessment, j) => {

        _.forEach(assessment.AssessmentGroup, (assessmentGroup, k) => {
          _.forEach(assessmentGroup.AssessmentGroupQuestion, (question, l) => {
            // Inject empty answer
            assessments[i][j].AssessmentGroup[k].AssessmentGroupQuestion[l].AssessmentQuestion.answer = null;

            // Find submission
            _.forEach(allSubmissions, (submissions) => {
              _.forEach(submissions, (submission) => {
                _.forEach(submission.AssessmentSubmissionAnswer, (answer) => {
                  if (answer.assessment_question_id === question.id) {
                    this.assessmentGroups[i][j].AssessmentGroup[k].AssessmentGroupQuestion[l].AssessmentQuestion.answer = answer;
                  }
                });
              });
            });
          });

          // Summarise basic answer information
          assessments[i][j].AssessmentGroup[k].totalQuestions =
            _.size(assessmentGroup.AssessmentGroupQuestion);

          assessments[i][j].AssessmentGroup[k].answeredQuestions = 0;
          _.forEach(assessmentGroup.AssessmentGroupQuestion, (q) => {
            if (q.AssessmentQuestion.answer !== null) {
              assessments[i][j].AssessmentGroup[k].answeredQuestions += 1;
            }
          });
        });
      });
    });

    return assessments;
  }

  loadQuestions(): Promise<any> {
    return new Promise((resolve, reject) => {

      // get_assessments request with "assessment_id" & "structured"
      let getAssessment = (assessmentId) => {
        return this.assessmentService.getAll({
          search: {
            assessment_id: assessmentId,
            structured: true
          }
        });
      };

      // Congregation of assessment ids to fulfill get_assessments API's param requirement
      let tasks = [];
      _.forEach(this.activity.References, (reference) => {
        if (
          reference.Assessment &&
          reference.Assessment.id
        ) {
          return tasks.push(getAssessment(reference.Assessment.id));
        }
      });

      // get_submissions API to retrieve submitted answer
      let getSubmissions = (contextId) => {
        return this.submissionService.getSubmissions({
          search: {
            context_id: contextId
          }
        });
      };

      // Congregation of get_submissions API Observable with different context_id
      let submissionTasks = [];
      _.forEach(this.activity.References, (reference) => {
        if (reference.context_id) {
          return submissionTasks.push(getSubmissions(reference.context_id));
        }
      });

      // first batch API requests (get_assessments)
      Observable.forkJoin(tasks)
        .subscribe(
          (assessments: any) => {
            this.assessmentGroups = assessments;

            console.log('this.assessmentGroups', this.assessmentGroups);

            // Required in page title.
            // @TODO: to be confirmed, we only have one assessment in this page.
            if (assessments) {
              this.assessment = _.head(assessments).Assessment || {};
              console.log('this.assessment', this.assessment)
            }

            // 2nd batch API requests (get_submissions)
            Observable.forkJoin(submissionTasks)
              .subscribe((allSubmissions) => {
                console.log('allSubmissions', allSubmissions);

                this.assessmentGroups = this.mapAssessmentsAndSubmissions(
                  this.assessmentGroups,
                  allSubmissions
                );

                // Check all questions have submitted
                _.forEach(this.assessmentGroups, (group, i) => {
                  _.forEach(group, (assessment, j) => {
                    _.forEach(this.assessmentGroups[i][j].AssessmentGroup, (g) => {
                      if (g.answeredQuestions < g.totalQuestions) {
                        this.allowSubmit = false;
                      }
                    });
                  });
                });

                console.log('this.assessmentGroups', this.assessmentGroups);
                console.log('allowSubmit', this.allowSubmit);
                resolve();
              },
              (err) => {
                console.log('err', err);
                reject();
              });
          },
          (e) => {
            console.log('e', e);
            reject();
          }
        );
    });
  }

  ionViewWillEnter() {
    // Hardcoded answers for now
    this.answers = this.cache.getLocalObject('answers') || {};

    let loader = this.loadingCtrl.create();
    loader.present().then(() => {
      this.loadQuestions()
      .then(() => {
        loader.dismiss();
      })
      .catch((err) => {
        console.log(err);
        loader.dismiss();
      });
    });
  }

  /**
   * @name doDiscard
   * @description clear assessment & submission localStorage
   */
  doDiscard(): void {
    this.cache.setLocalObject('answers', {});
  }

  /**
   * @name clickDiscard
   * @description inject click event to ionic native back button
   */
  clickDiscard(): void {
    // Send alert to user before user click back page
    // If user click okay will remove all answers in local storage
    // No data will send to server
    const confirm = this.alertCtrl.create({
      title: 'Discard all change',
      message: 'Do you really want to discard all your change?',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.doDiscard();
            this.navCtrl.pop();
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Discard cancelled');
          }
        }
      ]
    });
    confirm.present();
  }

  /**
   * @TODO: implementation required
   * @name doSubmit
   */
  doSubmit() {
    console.log('Okay');
  }

  clickSubmit() {
    const confirm = this.alertCtrl.create({
      title: 'Submit evidence',
      message: 'Do you really want to submit this evidence?',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.doSubmit();
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Submit cancelled');
          }
        }
      ]
    });
    confirm.present();
  }

  gotoAssessment(assessmentGroup, assessment, activity) {
    console.log('activity', activity);
    this.navCtrl.push(AssessmentsGroupPage, {
      activity,
      assessment,
      assessmentGroup,
      submissions: this.navParams.get('submissions')
    });
  }
}
