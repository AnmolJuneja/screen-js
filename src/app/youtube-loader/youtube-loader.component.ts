import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { IYoutube } from '../models/youtube.model';
import { YoutubeService } from '../services/youtube.service';
import { ContentLoaderComponent } from '../content-loader/content-loader.component';
import { AnalyticsService } from 'app/services/analytics.service';

@Component({
    selector: 'app-youtube-loader',
    templateUrl: './youtube-loader.component.html',
    styleUrls: ['./youtube-loader.component.css']
})
export class YoutubeLoaderComponent extends ContentLoaderComponent implements OnInit {

    youtube: IYoutube;

    constructor(
        private youtubeService: YoutubeService,
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
        this.youtubeService.getById(this.id, { token: this.token, acting: this.acting }).subscribe(
            (youtube: IYoutube) => {
                this.log.push(this.elapsedTime() + ' data loaded');
                this.youtube = youtube;
            },
            (error: any) => {
                this.log.push(this.elapsedTime() + ' ' + error.message);
            },
            () => {

            }
        );
    }

}
