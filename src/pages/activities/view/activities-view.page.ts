import { Component } from '@angular/core';
import { ModalController, NavParams, NavController } from 'ionic-angular';
import { ActivitiesViewModalPage } from './activities-view-modal.page';
import { AssessmentsPage } from '../../assessments/assessments.page';
import { ActivityService } from '../../../services/activity.service';
import { SubmissionService } from '../../../services/submission.service';
import { AchievementService } from '../../../services/achievement.service';

import * as _ from 'lodash';

@Component({
  templateUrl: './view.html'
})

export class ActivitiesViewPage {
  activity: any = {};
  assessment: any = {};
  assessments: any = {};
  submissions: Array<any> = [];

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private activityService: ActivityService,
    private submissionService: SubmissionService,
    private achievementService: AchievementService
  ) {
  }


  // @TODO: use simple mock data for assessment first
  /**
   * on assessment implementation, to do list:
   * - load badges
   * - change icon display based on responded data format
   * - load submission into this.submissions
   * - change template view based on responded data format
   */
  ionViewDidEnter(): void {
    this.activity = this.activityService.normaliseActivity(this.navParams.get('activity') || {});
    this.assessments = this.activity.sequences || [];

    this.assessment = this.activity.assessment;

    this.submissions = [];
    this.submissionService.getSubmissions({
      search: { context_id: this.assessment.context_id }
    }).subscribe(response => {
      if (response.length > 0) {
        console.log(this.submissions);
        this.submissions = response.map(submission => {
          return this.submissionService.normalise(submission);
        });
        console.log(this.submissions);
      }
    });

    // @TODO: badges images implementation (using get_achievement API)
    this.activity.badges = [
      {
        url: 'http://leevibe.com/images/category_thumbs/video/19.jpg',
        disabled: true,
      },
      {
        url: 'http://mobileapp.redcross.org.uk/achievements/heart-icon.png',
        disabled: true,
      },
      {
        url: 'http://americanredcross.3sidedcube.com/media/45334/fire-large.png',
        disabled: false,
      },
    ];

    this.activity.badges.map((badge, index) => {
      if ((this.activity.id % 3) != 0) {
        badge.disabled = false;
      } else {
        badge.disabled = true;
      }
    });

  }

  /**
   * @description display activity detail modal page
   */
  openModal() {
    let detailModal = this.modalCtrl.create(ActivitiesViewModalPage, {activity: this.activity});
    detailModal.present();
  }

  /**
   * @name goAssessment
   * @description direct to assessment page of a selected activity
   * @param {Object} activity single activity object from the list of
   *                          activities respond from get_activities API
   */
  goAssessment(activity) {
    this.navCtrl.push(AssessmentsPage, {
      activity,
      assessment: this.assessment,
      submissions: this.submissions
    });
  }
}
