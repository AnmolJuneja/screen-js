import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { IVideo } from '../models/video.model';
import { VideoService } from '../services/video.service';
import { ContentLoaderComponent } from '../content-loader/content-loader.component';
import { AnalyticsService } from 'app/services/analytics.service';

@Component({
    selector: 'app-video-loader',
    templateUrl: './video-loader.component.html',
    styleUrls: ['./video-loader.component.css']
})
export class VideoLoaderComponent extends ContentLoaderComponent {

    video: IVideo;

    constructor(
        private videoService: VideoService,
        protected route: ActivatedRoute,
        protected analytics: AnalyticsService
    ) {
        super(route, analytics);
    }

    setParams(params: Params) {
        super.setParams(params);
        this.loadVideo();
    }

    setQueryParams(params: Params) {
        super.setQueryParams(params);

        if (this.token) {
            this.loadVideo();
        } else {
            this.log.push(this.elapsedTime() + ' failed: insufficent permissions.');
        }
    }

    private loadVideo() {
        if (!this.token || !this.id) {
            return;
        }
        this.log.push(this.elapsedTime() + ' loading data...');
        this.videoService.getById(this.id, { token: this.token, acting: this.acting }).subscribe(
            (video: IVideo) => {
                this.log.push(this.elapsedTime() + ' data loaded');
                this.video = video;
            },
            (error: any) => {
                this.log.push(this.elapsedTime() + ' ' + error.message);
            },
            () => {

            }
        );
    }
}
