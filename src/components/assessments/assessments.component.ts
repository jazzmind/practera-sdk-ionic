import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as _ from 'lodash';

// import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'assessments',
  templateUrl: 'assessments.html'
})
export class AssessmentsComponent {
  @Input() assessments;

  constructor(
    public navCtrl: NavController
  ) {}

  ionViewDidEnter() {}

}
