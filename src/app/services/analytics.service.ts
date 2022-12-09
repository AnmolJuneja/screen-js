import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { IBroadcast } from '../models/broadcast.model';
import { IPlaylistItem } from '../models/playlistitem.model';
import { MixpanelService } from './mixpanel.service';
import { environment } from '../../environments/environment';

import * as ClientJS from 'clientjs';
import { CountedShowtime } from '../broadcast-engine/broadcast-engine';
import { AndroidPlatformService } from './android-platform.service';
import { IPlaylist } from 'app/models/playlist.model';

export interface IAnalyticsVendor {

    setUniqueId(uniqueId: string);

    /**
     * Sends with all the expected metadata
     * @param name Event name
     * @param data Bunch of key/value pairs
     */
    sendEvent(name: string, data: any): void;

    /** key value pairs */
    setVendorSpecific(settings: any): any;

}

@Injectable({
    providedIn: 'root', // singleton service.
})
export class AnalyticsService {

    private vendors: IAnalyticsVendor[] = [];

    private staticData: any;

    private runtimeData: any;

    constructor(
        private translate: TranslateService,
        private mixpanel: MixpanelService,
        private android: AndroidPlatformService
    ) {
        this.vendors.push(mixpanel);
        this.vendors.push(android);

        const client = new ClientJS();
        this.staticData = {
            ScreenJSVersion: environment.releaseInfo.build,
            isProduction: environment.production ? '1' : '0',
            Browser: client.getBrowser().name,
            BrowserVersion: client.getBrowser().version,
            Engine: client.getEngine().name,
            EngineVersion: client.getEngine().version,
            OS: client.getOS().name,
            OSVersion: client.getOS().version,
            Locale: this.translate.getBrowserLang()
        };
        this.runtimeData = {};

    }

    setUniqueId(uniqueId: string) {
        this.mixpanel.setUniqueId(uniqueId);
        if (!!uniqueId) {
            const parts = uniqueId.split(':');
            if (parts.length >= 2) {
                this.runtimeData['IdType'] = parts[0];
            }
        }
    }

    public setVendorSpecific(vendorName: string, settings: any): any {
        if (vendorName === '*') {
            return this.vendors.forEach(vendor => vendor.setVendorSpecific(settings));
        } else if (vendorName === 'mixpanel') {
            return this.mixpanel.setVendorSpecific(settings);
        }
        return { notfound: 1 };
    }

    appLaunch() {
        const props: any = this.union(this.staticData, this.runtimeData);
        this.vendors.forEach(vendor => vendor.sendEvent('Launch', props));
    }

    logGlobalError(message: string, url: string, stackString: string) {
        const eventSpecific: Object = {
            ErrorMsg: message,
            ErrorUrl: url,
            StackTrace: stackString
        };
        const props: any = this.union(this.staticData, this.runtimeData, eventSpecific);
        this.vendors.forEach(vendor => vendor.sendEvent('Global Error', props));
    }

    logScheduleRequested(): void {
        const props: any = this.union(this.staticData, this.runtimeData);
        this.vendors.forEach(vendor => vendor.sendEvent('Schedule Requested', props));
    }

    logScreenID(screen_id: string) {
        this.runtimeData['ScreenID'] = screen_id; // save screen ID
    }

    logScheduleReceived(broadcast: IBroadcast): void {
        // TODO:  Locale, TZ,
        this.runtimeData['ip'] = broadcast.ip;
        this.runtimeData['TZ'] = broadcast.screen.timezone;
        this.runtimeData['AccountID'] = broadcast.screen.accountId;
        this.runtimeData['LocationID'] = broadcast.screen.locationId;
        this.runtimeData['ChannelID'] = broadcast.screen.channelId;
        const props: any = this.union(this.staticData, this.runtimeData);
        this.vendors.forEach(vendor => vendor.sendEvent('Schedule Received', props));
    }

    logScheduleChanged(broadcast: IBroadcast): void {
        const props: any = this.union(this.staticData, this.runtimeData);
        this.vendors.forEach(vendor => vendor.sendEvent('Schedule Changed', props));
    }

    logScheduleRequestError(error: any): void {
        const eventSpecific: Object = {
            ErrorType: error.name,
            ErrorMsg: (!!error.message ? error.message : error.toString()),
        };
        const props = this.union(this.staticData, this.runtimeData, eventSpecific);
        this.vendors.forEach(vendor => vendor.sendEvent('Schedule Error', props));
    }

    logPlaylistQueued(cs: CountedShowtime) {
        const eventSpecific: Object = {
            Counter: cs.counter,
            Priority: cs.show.priority,
            ScheduledContentID: cs.show.scheduledContent.id,
            PlaylistID: cs.show.scheduledContent.playlistId,
            ChannelID: cs.show.scheduledContent.channelId,
        };
        const props = this.union(this.staticData, this.runtimeData, eventSpecific);
        this.vendors.forEach(vendor => vendor.sendEvent('Playlist Queued', props));
    }

    logPlaylistStarted(cs: CountedShowtime) {
        const eventSpecific: Object = {
            Counter: cs.counter,
            Priority: cs.show.priority,
            ScheduledContentID: cs.show.scheduledContent.id,
            PlaylistID: cs.show.scheduledContent.playlistId,
            ChannelID: cs.show.scheduledContent.channelId,
        };
        const props = this.union(this.staticData, this.runtimeData, eventSpecific);
        this.vendors.forEach(vendor => vendor.sendEvent('Playlist Started', props));
    }

    logPlaylistRepeat(playlist: IPlaylist) {
        const eventSpecific: Object = {
            PlaylistID: playlist.id,
        };
        const props = this.union(this.staticData, this.runtimeData, eventSpecific);
        this.vendors.forEach(vendor => vendor.sendEvent('Playlist Repeat', props));
    }

    logErrorPlaylistSkipped(cs: CountedShowtime) {
        const eventSpecific: Object = {
            Counter: cs.counter,
            Priority: cs.show.priority,
            ScheduledContentID: cs.show.scheduledContent.id,
            PlaylistID: cs.show.scheduledContent.playlistId,
            ChannelID: cs.show.scheduledContent.channelId,
        };
        const props = this.union(this.staticData, this.runtimeData, eventSpecific);
        this.vendors.forEach(vendor => vendor.sendEvent('Playlist Skipped', props));

    }

    logImageShown(item: IPlaylistItem) {
        const eventSpecific: Object = {
            MediaType: item.itemType,
            MediaID: item.itemId,
            DurationSecs: item.durationSecs
        };
        const props = this.union(this.staticData, this.runtimeData, eventSpecific);
        this.vendors.forEach(vendor => vendor.sendEvent('Image Shown', props));
    }

    logVideoShown(item: IPlaylistItem) {
        const eventSpecific: Object = {
            MediaType: item.itemType,
            MediaID: item.itemId,
            StartTime: item.startTime,
            DurationSecs: item.durationSecs
        };
        const props = this.union(this.staticData, this.runtimeData, eventSpecific);
        this.vendors.forEach(vendor => vendor.sendEvent('Video Shown', props));
    }

    logPlaylistItemPruned(item: IPlaylistItem) {
        const eventSpecific: Object = {
            PlaylistItem: item.id,
            MediaType: item.itemType,
            MediaID: item.itemId,
        };
        const props = this.union(this.staticData, this.runtimeData, eventSpecific);
        this.vendors.forEach(vendor => vendor.sendEvent('PlaylistItem Pruned', props));
    }

    // takes and array of objects and returns the union of them.
    private union(...args: any[]): any {
        const newObj = {};
        for (const obj of args) {
            for (const key of Object.keys(obj)) {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    }
}
