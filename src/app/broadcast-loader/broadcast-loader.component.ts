import { Component } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';

import { IBroadcast } from '../models/broadcast.model';
import { BroadcastService } from '../services/broadcast.service';
import { ContentLoaderComponent } from '../content-loader/content-loader.component';
import { AnalyticsService } from 'app/services/analytics.service';
import { AndroidPlatformService } from 'app/services/android-platform.service';
import { IPlaylistItem } from 'app/models/playlistitem.model';
import { IVideo } from 'app/models/video.model';
import { IImage } from 'app/models/image.model';
import { timer } from 'rxjs';

@Component({
    selector: 'app-broadcast-loader',
    templateUrl: './broadcast-loader.component.html',
    styleUrls: ['./broadcast-loader.component.css']
})
export class BroadcastLoaderComponent extends ContentLoaderComponent {
    lastChanged: moment.Moment;
    isAndroidEmulator: boolean;
    deltaTMins: number = 0; // time offset (for debugging)
    speedup: number = 1; // time speedup factor (for debugging)

    private _broadcast: IBroadcast;

    get broadcast(): IBroadcast {
        return this._broadcast;
    }

    set broadcast(newBroadcast: IBroadcast) {
        const defaultMediaUrls = this.extractUrlsOfDefaultMedia(newBroadcast);
        this.android.updateDefaultMedia(defaultMediaUrls);
        this._broadcast = newBroadcast;
    }

    constructor(
        private broadcastService: BroadcastService,
        protected route: ActivatedRoute,
        protected analytics: AnalyticsService,
        private android: AndroidPlatformService
    ) {
        super(route, analytics);
    }

    setParams(params: Params) {
        super.setParams(params);
        this.onCheckUpdates();
    }

    setQueryParams(params: Params) {
        super.setQueryParams(params);
        if (!!params && !!params.e) {  // turn on androidEmulator
            this.isAndroidEmulator = true;
        }
        if (!!params && !!params.dt) {
            const val: number = parseFloat(params.dt);
            this.deltaTMins = isNaN(val) ? 0 : val;
        }
        this.onCheckUpdates();
    }

    onCheckUpdates() {
        if (!this.id) {
            return;
        }
        if (this.verbose) { this.log.push(this.elapsedTime() + ' checking for new broadcast...'); }
        this.analytics.logScheduleRequested();
        this.broadcastService.getById(this.id, this.isAndroidEmulator, { token: this.token, acting: this.acting }).subscribe(
            (broadcast: IBroadcast) => {
                this.analytics.logScheduleReceived(broadcast);
                const recentChange = this.searchMostRecentChange(broadcast);
                if (!this.lastChanged || recentChange.isAfter(this.lastChanged)) {
                    if (this.verbose) {
                        this.log[this.log.length - 1] += 'Y';
                        this.log.push(this.elapsedTime() + ' launching new broadcast...');
                    }
                    this.analytics.logScheduleChanged(broadcast);
                    this.lastChanged = recentChange;
                    this.broadcast = broadcast;
                } else {
                    if (this.verbose) {
                        this.log[this.log.length - 1] += 'N';
                    }
                }
            },
            (error: any) => {
                this.analytics.logScheduleRequestError(error);
                if (this.verbose) {
                    this.log.push(this.elapsedTime() + ' ' + error.message);
                }
            },
            () => {

            }
        );
    }

    private searchMostRecentChange(broadcast: IBroadcast): moment.Moment {
        // let retval:moment.Moment = moment(broadcast.updatedAt);
        const allDates: moment.Moment[] = [];
        // 1. collect all the updatedAt dates for the channel, screen, playlists and all items therein
        allDates.push(moment(broadcast.channel.updatedAt));
        allDates.push(moment(broadcast.screen.updatedAt));
        broadcast.scheduledContent.forEach(item => allDates.push(moment(item.updatedAt)));
        broadcast.playlists.forEach(item => {
            allDates.push(moment(item.updatedAt));
            item.items.forEach(playlistItem => {
                allDates.push(moment(playlistItem.updatedAt));
            });
        });

        // 2. find the maximum of all the collected dates
        const maxDate: moment.Moment = allDates.reduce((previous, current, index) => {
            if (!!previous && previous.isValid() && !!current && current.isValid()) {
                return previous.isAfter(current) ? previous : current;
            } else if (!!previous && previous.isValid()) {
                return previous;
            } else {
                return current;
            }
        });
        return maxDate;
    }

    /**
     * Generate list of all content URLs associated with default loop of broadcast
     * @param broadcast new broadcast
     * @return list of URLs to be prefetched/cached
     */
    private extractUrlsOfDefaultMedia(broadcast: IBroadcast): string[] {
        const defaultPlaylist = broadcast.channel.defaultPlaylist;
        const urlStrings: string[] = [];
        defaultPlaylist.items.forEach((item: IPlaylistItem) => {
            if (item.itemType === 'video') {
                urlStrings.push((item.item as IVideo).contentUrl);
                urlStrings.push((item.item as IVideo).thumbnailUrl);
            } else if (item.itemType === 'image') {
                urlStrings.push((item.item as IImage).imageUrl);
                urlStrings.push((item.item as IImage).thumbnailUrl);
            } else if (item.itemType === 'url') {
                // can't really cache everything that may be pulled in from URL
                // urlStrings.push((item.item as IUrl).src);
            }
        });
        return urlStrings;
    }
}

