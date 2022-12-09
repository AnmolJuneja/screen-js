import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment-timezone';

import { AddulateBaseService } from './addulate-base.service';
import { environment } from '../../environments/environment';

import { IBroadcast } from '../models/broadcast.model';
import { IScheduledContent } from '../models/scheduled-content.model';
import { IPlaylistItem } from '../models/playlistitem.model';
import { IPlaylist } from '../models/playlist.model';
import { AnalyticsService } from './analytics.service';


@Injectable()
export class BroadcastService extends AddulateBaseService {

    constructor(
        private http: HttpClient,
        private analytics: AnalyticsService
    ) {
        super();
    }

    // Android emulator uses 10.0.2.2 instead of localhost
    getById(id: string, isAndroidEmulator: boolean, perms?: { token: string, acting: string }): Observable<IBroadcast> {
        const endpoint = isAndroidEmulator ? environment.androidEndpoint : environment.endpoint;
        const url = endpoint + '/scheduledContent/screen/' + id;
        return this.http.get<IBroadcast>(url).pipe(
            map(broadcast => {
                const tz: string = broadcast.screen.timezone;
                broadcast.playlists.forEach((playlist: IPlaylist) => {
                    playlist.items.forEach((item: IPlaylistItem) => {
                        if (item.itemType === 'video') {
                            item['item'] = broadcast.videos.find(value => value.id === item.itemId);
                        } else if (item.itemType === 'image') {
                            item['item'] = broadcast.images.find(value => value.id === item.itemId);
                        } else if (item.itemType === 'url') {
                            item['item'] = broadcast.urls.find(value => value.id === item.itemId);
                        } else if (item.itemType === 'widget') {
                            item['item'] = broadcast.widgets.find(value => value.id === item.itemId);
                        }
                    });
                    // filter out playlist items that have no match
                    playlist.items = playlist.items.filter((item: IPlaylistItem) => {
                        if (!item.item) {
                            this.analytics.logPlaylistItemPruned(item);
                            return false;
                        } else {
                            return true;
                        }
                    });
                    // update duration to be sum of the items
                    playlist.durationSecs = playlist.items
                        .map((value: IPlaylistItem) => value.durationSecs)
                        .reduce((total: number, current: number) => total + current);
                });
                broadcast.scheduledContent.forEach((scheduledContent: IScheduledContent) => {
                    scheduledContent['playlist'] = broadcast.playlists.find(value => value.id === scheduledContent.playlistId);
                    if (!!scheduledContent.recurranceRule) {
                        scheduledContent.recurranceRule = this.decodeRecurranceRule(scheduledContent.recurranceRule, tz);
                    }
                });
                broadcast.channel.defaultPlaylist = broadcast.playlists.find(value => value.id === broadcast.channel.defaultPlaylistId);
                return broadcast;
            }));
    }

    // even though the recurrance rule looks like UTC time, we interpret it as  local time.
    // And we now know the local time to decode it into.
    decodeRecurranceRule(rule: string, tz: string): string {
        const modified: string = rule.replace(/(\d{8}T\d{6})Z/g, (whole: string, datetimeOnly: string): string => {
            const adjusted: string = moment.tz(datetimeOnly, tz).utc().format('YYYYMMDD[T]HHmmSS[Z]');
            return adjusted;
        });
        return modified;
    }
}
