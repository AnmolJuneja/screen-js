import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { HttpResponse } from '@angular/common/http';
import { Observable, empty } from 'rxjs';

import { VgAPI } from 'videogular2/compiled/core';

import { IPlaylistItem } from '../models/playlistitem.model';
import { IVideo } from '../models/video.model';
import { AnalyticsService } from '../services/analytics.service';
import { ContentMediaComponent } from '../content-media/content-media.component';

@Component({
    selector: 'app-video-viewer',
    templateUrl: './video-viewer.component.html',
    styleUrls: ['./video-viewer.component.css']
})
export class VideoViewerComponent implements OnInit {
    private _video: IVideo;

    @Input()
    set video(video: IVideo) {
        if (!!video) {
            this.interactive = true;
            this._video = video;
            this.sources = [{ src: video.contentUrl, type: video.mimeType }];
            this.sourcesFirst = this.sources[0];
            this.play();
        } else {
            this._video = undefined;
            this.sources = [];
            this.sourcesFirst = undefined;
        }
    }
    get video(): IVideo {
        return this._video;
    }

    @Input()
    item: IPlaylistItem;

    @Input()
    index: number;

    @Input()
    showing: boolean;

    @Input()
    verbose: boolean;

    api: VgAPI;
    interactive: boolean = false;
    sources: Array<Object>;
    sourcesFirst: any;
    startTime: number = 0;

    constructor(
        private analytics: AnalyticsService
    ) {

    }

    ngOnInit() {
        if (!!this.item) {
            this.video = this.item.item as IVideo;
            this.startTime = this.item.startTime;
        }
    }

    onPlayerReady(api: VgAPI) {
        this.api = api;
    }

    seekTo(seekTime: number) {
        this.api.seekTime(seekTime);
    }

    ///////  Slide View Delegate Methods

    prefetch<T>(): Observable<HttpResponse<T>> {
        return empty();
    }

    play() {
        this.api.play();
        this.api.seekTime(this.startTime);
        this.api.volume = 1.0;
    }

    pause() {
        this.api.pause();
    }

    resume() {
        this.api.play();
    }

    interrupt() {
        this.api.pause();
    }

    complete() {
        this.analytics.logVideoShown(this.item);
        this.api.pause();
    }

    toggleVerbose() {
        this.verbose = !this.verbose;
    }
}
