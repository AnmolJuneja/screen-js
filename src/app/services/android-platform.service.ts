import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { IAnalyticsVendor } from './analytics.service';

// implementation provided by Android WebView
declare var Android;

@Injectable({
    providedIn: 'root'
})
export class AndroidPlatformService implements IAnalyticsVendor {

    private haveWarnedAboutWebview = false;
    private haveWarnedAboutSnapPhoto = false;
    private haveWarnedAboutUpdateDefaultMedia = false;
    private haveWarnedAboutOnJsEvent = false;

    constructor(private logger: NGXLogger) { }

    public snapPhoto(dateTimeString: string) {
        if (typeof Android !== 'undefined' && Android !== null) {
            try {
                return Android.snapPhoto(dateTimeString);
            } catch (err) {
                if (!this.haveWarnedAboutSnapPhoto) {
                    this.logger.warn('Android.snapPhoto() not supported by host application');
                    this.haveWarnedAboutSnapPhoto = true;
                }
            }
        } else {
            this.warnWebview();
        }
    }

    public updateDefaultMedia(media: string[]) {
        if (typeof Android !== 'undefined' && Android !== null) {
            try {
                return Android.updateDefaultMedia(JSON.stringify(media));
            } catch (err) {
                if (!this.haveWarnedAboutUpdateDefaultMedia) {
                    this.logger.warn('Android.updateDefaultMedia() not supported by host application');
                    this.haveWarnedAboutUpdateDefaultMedia = true;
                }
            }
        } else {
            this.warnWebview();
        }
    }

    //
    //  IAnalyticsVendor
    //

    public setUniqueId(uniqueId: string) { }

    /**
     * Sends with all the expected metadata
     * @param name Event name
     * @param data Bunch of key/value pairs
     */
    public sendEvent(name: string, data: any): void {
        if (typeof Android !== 'undefined' && Android !== null) {
            try {
                return Android.onJsEvent(name, JSON.stringify(data));
            } catch (err) {
                if (!this.haveWarnedAboutOnJsEvent) {
                    this.logger.warn('Android.onJsEvent() not supported by host application');
                    this.haveWarnedAboutOnJsEvent = true;
                }
            }
        } else {
            this.warnWebview();
        }
    }

    /** key value pairs */
    public setVendorSpecific(settings: any): any { }

    private warnWebview() {
        if (!this.haveWarnedAboutWebview) {
            this.haveWarnedAboutWebview = true;
            this.logger.warn('Android Webview not detected: can\'t capture photo without it.');
        }
    }

}
