import { Injectable }    from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { RequestService } from '../shared/request/request.service';
import * as _ from 'lodash';
import { CacheService } from '../shared/cache/cache.service';

@Injectable()
export class MilestoneService {
  milestones: any = {};
  private appkey = this.request.getAppkey();
  private prefixUrl: any = this.request.getPrefixUrl();
  constructor(
    private cacheService: CacheService,
    private request: RequestService,
    private http: Http
  ) {}
  getList(options?) {
    let params: URLSearchParams = new URLSearchParams();

    if (options && options.search) {
      // @TODO: Move to helper function
      _.forEach(options.search, (value, key) => {
        params.set(key, value);
      });
    }
    let timelineId = this.cacheService.getLocalObject('timelineID');
    if (timelineId) {
      params.set('timelineId', timelineId);
    }
    return this.request.get('api/milestones.json', {search: params});
  }

  getMilestones() {
    return this.request.get('api/milestones.json');
  }
}
