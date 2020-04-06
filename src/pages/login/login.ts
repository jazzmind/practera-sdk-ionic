import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController,
         NavParams,
         LoadingController,
         AlertController,
         ModalController,
         ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../app/messages';
// services
import { AuthService } from '../../services/auth.service';
import { MilestoneService } from '../../services/milestone.service';
import { NotificationService } from '../../shared/notification/notification.service';
import { CacheService } from '../../shared/cache/cache.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { GameService } from '../../services/game.service';
import { RequestServiceConfig } from '../../shared/request/request.service';
// directives
import {FormValidator} from '../../validators/formValidator';
// pages
import { TabsPage } from '../../pages/tabs/tabs.page';
import { ForgetPasswordPage } from '../../pages/forget-password/forget-password';
import { default as Configuration } from '../../configs/config';
import * as _ from 'lodash';

const DEFAULT_LOGO = './assets/img/main/logo.svg';

/* This page is for handling user login process */
@Component({
  selector: 'page-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginPage implements OnInit {
  public styles: {color: string; backgroundColor: string};
  public logoSrc: string;
  public email: string;
  public password: any;
  public userName: string;
  public userImage: string;
  public API_KEY: string;
  public milestone_id: string;
  public loginFormGroup: any;
  public forgetpasswordPage = ForgetPasswordPage;
  public loginLoadingMessages: any = loadingMessages.Login.login;
  public invalidLoginMessage: any = errMessages.Login.login;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private authService: AuthService,
    private gameService: GameService,
    public translationService: TranslationService,
    private config: RequestServiceConfig,
    private formBuilder: FormBuilder,
    private milestoneService: MilestoneService,
    private cacheService: CacheService,
    private notificationService: NotificationService,
    private utilsService: UtilsService

  ) {
    this.styles = {
      color: '',
      backgroundColor: '',
    };
    this.logoSrc = '';
    this.navCtrl = navCtrl;
    this.loginFormGroup = formBuilder.group({
      email: ['', [FormValidator.isValidEmail, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async ngOnInit() {
    const res = await this.authService.experienceConfig().toPromise();

    // if (res && res.data && res.data.length > 0) {
      // const thisExperience = res.data[0];
      const thisExperience = {"name":"Personal Edge Test Experience 1.0","config":{"app":{"name":"ISDK"},"enrolment":{"whitelist_emails":["beenish@test.com"]},"tabs":{"events":{"name":"events","title":"Events","icon":"md-calendar","order":2},"rankings":{"name":"rankings","title":"Rankings","icon":"md-medal","order":3},"settings":{"name":"settings","title":"Settings","icon":"md-person","order":4}},"theme_color":"#5da2ac","card_style":"waves-light.png","review_rating":false,"review_rating_notification":false,"deep_link_in_app":true,"achievement_in_app_mentor":false,"achievement_in_app_participant":true,"due_dates_in_app":false,"truncate_description":true,"cutie":true,"progress_caculation_without_hidden":false},"logo":"/storage/filestores/open/41471.png","background_image":""};
      if (thisExperience.logo) {
        this.logoSrc = `${Configuration.prefixUrl}${thisExperience.logo}`;
        await this.cacheService.write('branding.logo', this.logoSrc);
        this.cacheService.setLocalObject('branding.logo', this.logoSrc);
      }

      if (thisExperience.config && thisExperience.config.theme_color) {
        this.styles = {
          color: `${thisExperience.config.theme_color}`,
          backgroundColor: `${thisExperience.config.theme_color}`,
        };
        await this.cacheService.write('branding.color', this.styles.color);
        this.cacheService.setLocalObject('branding.color', this.styles.color);
      }
    // }

    if (_.isEmpty(this.logoSrc)) {
      this.logoSrc = DEFAULT_LOGO;
    }
  }

  ionViewCanLeave(): boolean {
    // user is authorized
    let authorized = true;
    if (authorized){
      return true;
    } else {
      return false;
    }
  }

  /**
   * user login function to authenticate user with email and password
   */
  userLogin() {
    let self = this;
    this.utilsService.changeThemeColor('red');

    this.cacheService.clear().then(() => {
      // add loading effect during login process
      const loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content: this.loginLoadingMessages
      });
      loading.present().then(() => {
        // This part is calling post_auth() API from backend
        this.authService.loginAuth(this.email, this.password)
            .subscribe(data => {
              // this.getLogInData(data);
              self.cacheService.setLocalObject('apikey', data.apikey);
              if (data.Experience.config) {
                self.cacheService.setLocalObject('config', data.Experience.config);
              }

              // saved timeline id for later
              const thisTimeline = data.Timelines[0];

              // if no timeline available (throw error)
              if (!thisTimeline) {
                throw "Current student hasn't enrolled in any timeline.";
              }

              if (data.Timelines.length > 0) {
                self.cacheService.setLocalObject('timelineID', thisTimeline.Timeline.id);
                // to tell current enrolment status ('fullaccess'/'readonly')
                self.cacheService.setLocalObject('enrolmentStatus', thisTimeline.Enrolment.status);
              }
              self.cacheService.setLocalObject('teams', data.Teams);
              self.cacheService.setLocal('gotNewItems', false);

              // get game_id data after login
              this.gameService.getGames()
                  .subscribe(
                    data => {
                      _.map(data, (element) => {
                        this.cacheService.setLocal('game_id', element[0].id);
                      });
                    },
                    err => {
                      console.log("game err: ", err);
                    }
                  );
              // get milestone data after login
              this.authService.getUser()
                  .subscribe(
                    data => {
                      self.cacheService.setLocalObject('name', data.User.name);
                      self.cacheService.setLocalObject('email', data.User.email);
                      self.cacheService.setLocalObject('program_id', data.User.program_id);
                      self.cacheService.setLocalObject('project_id', data.User.project_id);
                      self.cacheService.setLocalObject('user', data.User);
                    },
                    err => {
                      console.log(err);
                    }
                  );

              this.gameService.getGames()
                .subscribe((data) => {
                  if (data.Games) {
                    // For now only have one game per project
                    self.cacheService.setLocalObject('game_id', data.Games[0].id);
                  }
                });

              // get milestone data after login
              this.milestoneService.getMilestones()
                  .subscribe(
                    data => {
                      loading.dismiss().then(() => {
                        this.milestone_id = data[0].id;
                        self.cacheService.setLocalObject('milestone_id', data[0].id);
                        this.navCtrl.setRoot(TabsPage).then(() => {
                          this.viewCtrl.dismiss(); // close the login modal and go to dashaboard page
                          window.history.replaceState({}, '', window.location.origin);
                        });
                      });
                    },
                    err => {
                      console.log(err);
                    }
                  )
              this.cacheService.write('isAuthenticated', true);
              this.cacheService.setLocal('isAuthenticated', true);
            }, err => {
              loading.dismiss().then(() => {
                const data = err.data;
                if (err.status === 'unauthorized' && (data && data.type === 'password_compromised')) {
                  this.notificationService.alert({
                    title: 'Weak Password',
                    message: `We’ve checked this password against a global database of insecure passwords and your password was on it. <br>We have sent you an email with a link to reset your password. <br>You can learn more about how we check that <a href="https://haveibeenpwned.com/Passwords">database</a>`,
                    buttons: [
                      'Close'
                    ]
                  });
                } else {
                  this.logError(err);
                }

                this.cacheService.removeLocal('isAuthenticated');
                this.cacheService.write('isAuthenticated', false);
              });
            });
      });
    });
  }
  /**
   * Insert post_auth() api result into localStorage
   * @param {object} data result from API request
   * @returns Observable/subject
   */
  getLogInData(data){
    let cacheProcesses = [];
    _.forEach(data, (datum, key) => {
      cacheProcesses.push(this.cacheService.write(key, datum));
    });
    cacheProcesses.push(this.cacheService.write('timeline_id', data.Timelines[0].Timeline.id));
    cacheProcesses.push(this.cacheService.write('apikey', data.apikey));
    cacheProcesses.push(this.cacheService.write('timelines', data.Timelines));
    cacheProcesses.push(this.cacheService.write('experience', data.Experience));
    cacheProcesses.push(this.cacheService.write('teams', data.Teams));
    this.cacheService.setLocal('apikey', data.apikey);
    this.cacheService.setLocal('timeline_id', data.Timelines[0].Timeline.id);
    return Observable.from(cacheProcesses);
  }
  /**
   * Insert get_user() api result into localStorage
   * @param {object} user result from API request
   */
  getUserKeyData(user){
    let userData = {
      'apikey': user.data.apikey,
      'timelines': user.data.Timelines
    }
    this.cacheService.write('userData', userData);
    this.cacheService.setLocalObject('userData', userData);
    this.API_KEY = user.data.apikey;
    // to get API KEY and timeline_id and stored in localStorage
    // then other API calls can directly use (API KEY and timeline_id)
  }
  /**
   * @TODO we'll come back to this logging workflow later in this development
   *
   * This function is used to log unexpected error accountered in the client side
   * @param {object} error result from API request
   */
  logError(error) {
    const alert = this.alertCtrl.create({
      title: 'Login Failed ...',
      message: this.invalidLoginMessage,
      buttons: ['Close']
    });
    alert.present();
    // handle API calling errors display with alert controller
  }
  /**
   * forget password page link function
   */
  linkToForgetPassword() {
    this.navCtrl.push(this.forgetpasswordPage);
    this.viewCtrl.dismiss();
  }
}
