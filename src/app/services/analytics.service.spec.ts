/* tslint:disable:no-unused-variable */

import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { environment } from '../../environments/environment';

describe('AnalyticsService', () => {
    let fakeTranslateService: any;
    let fakeMixpanelService: any;
    let fakeAndroidPlatformService: any;
    let service: AnalyticsService;

    beforeEach(() => {
        fakeTranslateService = jasmine.createSpyObj('TranslateService', ['getBrowserLang']);
        fakeTranslateService.getBrowserLang.and.returnValue('en');

        fakeMixpanelService = jasmine.createSpyObj('MixpanelState', ['sendEvent']);
        fakeMixpanelService.verbose = false;
        fakeMixpanelService.distinct_id = '1234';

        fakeAndroidPlatformService = jasmine.createSpyObj('AndroidPlatformService', ['sendEvent']);

        service = new AnalyticsService(fakeTranslateService, fakeMixpanelService, fakeAndroidPlatformService);
    });

    it('should be true', () => {
        expect(1 + 1).toBe(2);
    });

    it('should be creatable', () => {
        expect(service).toBeTruthy();
    });

    it('should log a "Launch" event on appLaunch()', () => {
        service.appLaunch();

        expect(fakeMixpanelService.sendEvent).toHaveBeenCalledWith('Launch', jasmine.objectContaining({
            ScreenJSVersion: environment.releaseInfo.build
        }));
    });

    it('should log a "Schedule Requested" event on logScheduleRequested()', () => {
        service.logScheduleRequested();

        expect(fakeMixpanelService.sendEvent).toHaveBeenCalledWith('Schedule Requested', jasmine.objectContaining({
            ScreenJSVersion: environment.releaseInfo.build
        }));
    });


});
