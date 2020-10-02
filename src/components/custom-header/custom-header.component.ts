import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { CacheService } from '../../shared/cache/cache.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import * as _ from 'lodash';

@Component({
  selector: 'custom-header',
  templateUrl: 'custom-header.html'
})
export class CustomHeaderComponent implements OnChanges {
  @Input() customHeader: SafeStyle;
  isMobileSize: boolean;

  constructor(
    private cacheService: CacheService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes.customHeader && changes.customHeader.currentValue) {
      this.customHeader = this.sanitizer.bypassSecurityTrustHtml(changes.customHeader.currentValue);
    } else if (changes.customHeader && _.isEmpty(changes.customHeader.currentValue)) {
      const html_branding = this.cacheService.getLocalObject('user.branding.html');
      if (html_branding && html_branding.header) {
        this.customHeader = this.sanitizer.bypassSecurityTrustHtml(html_branding.header);
      }
    }
  }
}
