import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { IPlaylist } from '../models/playlist.model';
import { PlaylistService } from '../services/playlist.service';
import { ContentLoaderComponent } from '../content-loader/content-loader.component';
import { AnalyticsService } from 'app/services/analytics.service';
import { PlaylistViewerComponent } from '../playlist-viewer/playlist-viewer.component';

@Component({
    selector: 'app-playlist-loader',
    templateUrl: './playlist-loader.component.html',
    styleUrls: ['./playlist-loader.component.css']
})
export class PlaylistLoaderComponent extends ContentLoaderComponent {


    @ViewChild(PlaylistViewerComponent, { static: false })
    private viewer: PlaylistViewerComponent;

    playlist: IPlaylist;

    constructor(
        private playlistService: PlaylistService,
        protected route: ActivatedRoute,
        protected analytics: AnalyticsService
    ) {
        super(route, analytics);
    }

    setParams(params: Params) {
        super.setParams(params);
        this.loadPlaylist();
    }

    setQueryParams(params: Params) {
        super.setQueryParams(params);

        if (this.token) {
            this.loadPlaylist();
        } else {
            this.log.push(this.elapsedTime() + ' failed: insufficent permissions.');
        }
    }

    private loadPlaylist() {
        if (!this.token || !this.id) {
            return;
        }
        this.log.push(this.elapsedTime() + ' loading data...');
        this.playlistService.getById(this.id, { token: this.token, acting: this.acting }).subscribe(
            (playlist: IPlaylist) => {
                this.log.push(this.elapsedTime() + ' data loaded');
                this.playlist = playlist;
                this.viewer.autoplay();
            },
            (error: any) => {
                this.log.push(this.elapsedTime() + ' ' + error.message);
            },
            () => {

            }
        );
    }

}
