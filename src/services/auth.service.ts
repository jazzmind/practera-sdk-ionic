import { Injectable } from '@angular/core';
import { RequestService, CustomQueryEncoder } from '../shared/request/request.service';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';

export interface ProfileData {
  image:string
}
@Injectable()
export class AuthService {
  private appkey: any = this.request.getAppkey();
  private prefixUrl: any = this.request.getPrefixUrl();
  private AUTH_ENDPOINT: any = this.prefixUrl + 'api/auths.json?action=';
  public headerData() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('appkey', this.appkey);
    return headers;
  }
  constructor(private request: RequestService,
              private http: Http) {}
  getTerms() {
    let options = new RequestOptions({headers: this.headerData()});
    return this.http.get(this.prefixUrl+'api/registration_details.json', options)
                    .map(res => res.json());
  }
  verifyRegistration(data) {
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams([
      `email=${data.email}`,
      `key=${data.key}`
    ].join('&'));
    return this.http.post(this.AUTH_ENDPOINT+'verify_registration', urlSearchParams.toString(), options)
                    .map(res => res.json());
  }

  register(data) {
    let urlSearchParams = new URLSearchParams([
      `password=${data.password}`,
      `user_id=${data.user_id}`,
      `key=${data.key || 'thisissamplekey'}`
    ].join('&'));
    return this.request.post('api/auths.json?action=registration', urlSearchParams, {
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  }

  loginAuth(email, password) {
    let urlSearchParams = new URLSearchParams([
      `data[User][email]=${email}`,
      `data[User][password]=${password}`
    ].join('&'));
    return this.request.post('api/auths.json?action=authentication', urlSearchParams, {
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  }

  forgotPassword(email){
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('email', email);
    return this.http.post(this.AUTH_ENDPOINT+'forgot_password', urlSearchParams.toString(), options)
                    .map(res => res.json());
  }

  verifyUserKeyEmail(key, email){
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams([
      `key=${key}`,
      `email=${email}`
    ].join('&'));
    return this.request.post('api/auths.json?action=verify_reset_password', urlSearchParams);
  }

  resetUserPassword(key, email, password, verify_password) {
    let urlSearchParams = new URLSearchParams([
      `key=${key}`,
      `email=${email}`,
      `password=${password}`,
      `verify_password=${verify_password}`
    ].join('&'));
    return this.request.post('api/auths.json?action=reset_password', urlSearchParams);
  }

  magicLinkLogin(auth_token){
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('auth_token', auth_token);
    return this.http.post(this.prefixUrl+'api/auths.json?', urlSearchParams.toString(), options)
                    .map(res => res.json());
  }

  getUser() {
    return this.request.get('api/users.json');
  }
  isAuthenticated() {
    return true;
  }

  editUserProfile(profiledata: ProfileData) {
    return this.request.post('api/v2/user/account/edit', profiledata, {
      'Content-Type': 'application/json'
    });
  }

}
