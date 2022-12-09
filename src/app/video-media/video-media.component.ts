
import { Component, AfterViewInit, Input, ElementRef, ViewChild, Renderer2, Output, EventEmitter } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';

import { ContentMediaComponent } from '../content-media/content-media.component';
import { IPlaylistItem } from '../models/playlistitem.model';
import { IVideo } from '../models/video.model';
import { AnalyticsService } from '../services/analytics.service';
import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'app-video-media',
    templateUrl: './video-media.component.html',
    styleUrls: ['./video-media.component.css'],
    animations: [
        trigger('fade', [
            state('void', style({ opacity: 0 })),
            state('hidden', style({ opacity: 0 })),
            state('showing', style({ opacity: 1 })),
            transition('hidden <=> showing', [
                animate(1000)
            ]),
            transition('void <=> showing', [
                animate(1000)
            ]),
        ])
    ],
})
export class VideoMediaComponent extends ContentMediaComponent implements AfterViewInit {

    private _rollback: number = 1;
    private _playlistItem: IPlaylistItem;

    @ViewChild('videoElt', { static: true, read: ElementRef })
    videoElt: ElementRef;

    @Input()
    autoplay: boolean = true;

    @Input()
    set playlistItem(playlistItem: IPlaylistItem) {
        if (this._playlistItem === playlistItem) { return; }
        this._playlistItem = playlistItem;
        this.video = this.playlistItem.item as IVideo;
        this.sources = [{ src: this.video.contentUrl, type: this.video.mimeType }];
        this.sourcesFirst = this.sources[0]; // this sets the html details.
        this.load();
        // this.videoElt.nativeElement.load();
        // this.reset();
    }

    get playlistItem(): IPlaylistItem {
        return this._playlistItem;
    }

    private videoState: string = 'loading';

    video: IVideo;

    sources: Array<Object>;
    sourcesFirst: any;

    lastEvent: string;

    constructor(
        private analytics: AnalyticsService,
        private renderer: Renderer2,
        private logger: NGXLogger,
    ) {
        super();
    }

    ngAfterViewInit(): void {
        // this.videoElt.nativeElement.onError = () => {
        //     this.logger.error('JSError' + this.videoElt.nativeElement.error.code +
        //         ': details = ' + this.videoElt.nativeElement.error.message);
        // };

        const eventnames: string[] = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'encrypted', 'ended', 'error', 'interruptbegin', 'interruptend',
            'loadeddata', 'loadedmetadata', 'loadedstart', 'mozaudioavailable', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend',
            'timeupdate', 'volumechange', 'waiting'];
        eventnames.forEach((eventname: string) => {
            this.renderer.listen(this.videoElt.nativeElement, eventname, (event: any): boolean => {
                if (eventname === this.lastEvent) { return false; }
                const message: string = 'video: ' + eventname + ' ' + this.video.id + '(' + this.video.title + ')';
                if (eventname === 'abort' || eventname === 'error') {
                    this.logger.error(message);
                    if (!!this.videoElt.nativeElement.error) {
                        this.logger.error('Error ' + this.videoElt.nativeElement.error.code + '; details: ' + this.videoElt.nativeElement.error.message);
                    }
                } else if (eventname === '' || eventname === '') {
                    this.logger.warn(message);
                } else {
                    // this.logger.info(message);
                }
                this.lastEvent = eventname;
                return true;
            });
        });
    }

    // TODO: add prefetch along lines of
    // prefetch(): Promise<void> {
    //     this.videoElt.nativeElement.load(); // ref https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    //     return fetch(this.video.contentUrl)
    //         .then(response => response.blob())
    //         .then(blob => {
    //             this.videoElt.nativeElement.srcObject = blob;
    //         });
    // }

    async load(): Promise<boolean> {
        this.videoElt.nativeElement.load(); // ref https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
        // return fetch(this.video.contentUrl)
        //     .then(response => response.blob())
        //     .then(blob => {
        //         this.videoElt.nativeElement.srcObject = blob;
        //         this.seekTo(this.playlistItem.startTime);
        //         this.pause();
        //     })
        //     .then(_ => true);
        return Promise.resolve(true);
    }

    // TODO: change API to return a promise?
    async play(): Promise<boolean> {
        await super.play();
        const playPromise = this.videoElt.nativeElement.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // this.logger.info('native <video>.play() succeeded.');
                })
                .catch((error) => {
                    this.logger.error('error: native <video>.play() failed. ' + error);
                });
            return playPromise;
        } else {
            return Promise.resolve(true);
        }
    }

    pause() {
        super.pause();
        this.videoElt.nativeElement.pause();
    }

    hide() {
        super.hide();
        /*
        setTimeout(() => {
            this.reset();
        }, 1000);
        */
    }

    complete(): void {
        super.complete();
        this.analytics.logVideoShown(this._playlistItem);
    }

    reset(): void {
        super.reset();
        this.seekTo(this.playlistItem.startTime);
        this._rollback = 1;
    }

    // TODO: setElapsedMSecs needs to return state information
    // or take some more drastic action in some cases (e.g.video freeze)
    setElapsedMSecs(elapsedMSecs: number) {
        super.setElapsedMSecs(elapsedMSecs);
        if (this.videoState === 'playing') {

            // this aritmetic is in floating point seconds.
            const secsThisLap = this.mSecsThisLap / 1000;

            // bounds checking
            if (secsThisLap < 0) {
                this.logger.error(`ERROR: secsThisLap=${secsThisLap} should be >= 0`);
            }
            if (secsThisLap > this._playlistItem.durationSecs + 2) { // 2 seconds to quit
                this.logger.warn(`WARNING: secsThisLap=${secsThisLap} exceeds durationSecs=${this._playlistItem.durationSecs} by more than 2 seconds`);
            }

            const actualPhtSecs = this.videoElt.nativeElement.currentTime;
            const expectedPhtSecs = secsThisLap + this._playlistItem.startTime;
            const outOfSyncSecs: number = Math.abs(actualPhtSecs - expectedPhtSecs);
            if (outOfSyncSecs > (5 * this._rollback)) {
                this._rollback = this._rollback * 2; // exponential backoff
                this.logger.warn('Warning: elapsedSecs=' + elapsedMSecs / 1000 +
                    ', effectiveSecs=' + secsThisLap +
                    ', startTime=' + this._playlistItem.startTime +
                    ', actualPHT=' + actualPhtSecs +
                    ', expectedPHT=' + expectedPhtSecs +
                    ', outOfSyncSecs = ' + outOfSyncSecs +
                    ', .... adjusting PHT');
                this.seekTo(outOfSyncSecs);
                // this.play();
            } else {
                // this.logger.debug('outofSync = ', outOfSyncSecs);
            }
        }
    }

    // template callbacks

    onCanPlay($event: any) {
        setTimeout(() => {
            if (this.visualState === 'showing' && this.videoState === 'loading' && this.autoplay) {
                this.videoState = 'canPlay';
                this.reset();
                this.play();
            }
        }, 1000);
    }

    onCanPlayThrough($event: any) {
        this.loaded.emit(1.0);
    }

    onPlay($event: any) {
        this.videoState = 'playing';
        this.playing.emit();
    }

    onEnded($event: any) {
        this.videoState = 'ended';
        this.ended.emit();
    }

    onError($event: any) {
        this.videoState = 'error';
        this.loadError.emit($event);
    }

    onTimeUpdate($event: any) {
        // this.logger.log('timeupdate', this.videoElt.nativeElement.currentTime);
    }

    private seekTo(seekTimeSecs: number) {
        this.videoElt.nativeElement.currentTime = seekTimeSecs;
    }

}
