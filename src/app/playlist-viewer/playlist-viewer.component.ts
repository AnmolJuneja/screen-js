import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';

import { Subscription, Observable, timer } from 'rxjs';

import { IPlaylist } from '../models/playlist.model';
import { PlaylistMediaComponent } from '../playlist-media/playlist-media.component';

@Component({
    selector: 'app-playlist-viewer',
    templateUrl: './playlist-viewer.component.html',
    styleUrls: ['./playlist-viewer.component.css']
})
export class PlaylistViewerComponent implements OnInit, AfterViewInit {
    private readonly TIMER_INTERVAL: number = 50; // MSecs

    @ViewChild(PlaylistMediaComponent, { static: false })
    private playlistMedia: PlaylistMediaComponent;

    @Input() playlist: IPlaylist;

    @Input() verbose: boolean = false;

    elapsedTimeMSecs: number = 0;

    playPauseButtonLabel: string = 'play_arrow';

    timer: Observable<number>;
    timerSubscription: Subscription;
    timerStartWallclock: Date;
    timerOffset: number = 0;

    constructor() { }

    ngOnInit() {
        this.timer = timer(0, this.TIMER_INTERVAL);
    }

    ngAfterViewInit() {

    }

    uiPlayPauseButtonClicked(): void {
        if (this.timerSubscription) {
            // we are already playing, so pause
            this.pause();
            this.playPauseButtonLabel = 'play_arrow'; // click again to play
            if (!!this.playlistMedia) { this.playlistMedia.pause(); }
        } else {
            this.play();
            this.playPauseButtonLabel = 'pause';
            if (!!this.playlistMedia) { this.playlistMedia.play(); }
        }
    }

    uiResetButtonClicked(): void {
        this.elapsedTimeMSecs = 0;
        this.timerStartWallclock = new Date();
        this.timerOffset = 0;
    }

    public autoplay(): void {
        this.uiPlayPauseButtonClicked();
    }

    private play(): void {
        this.timerStartWallclock = new Date();
        this.timerSubscription = this.timer.subscribe(() => this.tick());
    }

    private pause(): void {
        this.timerOffset +=
            new Date().valueOf() - this.timerStartWallclock.valueOf();
        this.timerStartWallclock = undefined;
        this.timerSubscription.unsubscribe();
        this.timerSubscription = undefined;
    }

    private tick() {
        this.elapsedTimeMSecs =
            this.timerOffset +
            (new Date().valueOf() - this.timerStartWallclock.valueOf());
    }
}
