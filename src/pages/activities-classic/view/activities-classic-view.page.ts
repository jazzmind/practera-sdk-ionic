import { Component } from '@angular/core';
import { ModalController, NavParams, NavController } from 'ionic-angular';
import { ActivitiesClassicViewModalPage } from './activities-classic-view-modal.page';
import { AssessmentsPage } from '../../assessments/assessments.page';

@Component({
  templateUrl: './view.html'
})

export class ActivitiesClassicViewPage {
  activity: any = {};
  submissions: Array<any> = [];

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController
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
    this.activity = this.navParams.get('activity');
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

    let submission = [];
    if (this.activity.Activity.name === 'Workshop-2') {
      submission.push({
        title: 'Submission 1',
        submittedOn: 'Thu Jun 19 2017 17:37:08',
        status: 'Pending Review'
      });
      this.activity.badges.map((badge, index) => {
        if (index === 1 || index === 0) {
          badge.disabled = false;
        } else {
          badge.disabled = true;
        }
      });
    } else {
      submission.push({
        title: 'Submission 1',
        submittedOn: '',
        status: 'Do Now'
      });
    }

    this.submissions = submission;
    console.log(this.activity);
  }

  /**
   * @description display activity detail modal page
   */
  openModal() {
    let detailModal = this.modalCtrl.create(ActivitiesClassicViewModalPage, {activity: this.activity});
    detailModal.present();
  }

  /**
   * @description direct to assessment page of a selected activity
   * @param {Object} activity single activity object from the list of
   * activities respond from get_activities API
   */
  goAssessment(activity) {
    this.navCtrl.push(AssessmentsPage, {activity});
  }
}