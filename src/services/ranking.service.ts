import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';
// services
import { CacheService } from '../shared/cache/cache.service';
@Injectable()
export class RankingService {
  constructor(private request: RequestService,
              private cacheService: CacheService) {}
  // List Total Users Rankings 
  public getRankings(){
    return ;
  }
}