import { Component, OnInit, Input, ViewChild, ComponentRef, ComponentFactoryResolver, OnDestroy, Renderer2, Output, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';

import { Subscription, Observable, timer } from 'rxjs';

import { NGXLogger } from 'ngx-logger';

import { BroadcastEngine, CountedShowtime } from '../broadcast-engine/broadcast-engine';
import { AnalyticsService } from '../services/analytics.service';
import { IBroadcast } from '../models/broadcast.model';
import { IPlaylist } from '../models/playlist.model';
import * as moment from 'moment-timezone';
import { BroadcastInsertDirective } from '../broadcast-insert.directive';
import { PlaylistMediaComponent } from '../playlist-media/playlist-media.component';
import { ComponentFactory } from '@angular/core';
import { Showtime } from 'app/broadcast-engine/showtime';
import { AndroidPlatformService } from 'app/services/android-platform.service';

interface IDemoInfo {
    screenId: string;
    dateTime: string;
    imageUrl: string;
    captureOnly?: boolean;
}

@Component({
    selector: 'app-broadcast-viewer',
    templateUrl: './broadcast-viewer.component.html',
    styleUrls: ['./broadcast-viewer.component.css']
})
export class BroadcastViewerComponent implements OnInit, OnDestroy {
    private readonly TIMER_INTERVAL: number = 200; // MSecs
    private readonly CHECK_INTERVAL: number = 2 * 60 * 1000; // MSecs

    private _broadcast: IBroadcast;
    private engine: BroadcastEngine;

    private timer: Observable<number>;
    private timerSubscription: Subscription;
    private playlistMedia: PlaylistMediaComponent;
    private lastScheduleCheck: moment.Moment;

    private componentRefQueue: ComponentRef<PlaylistMediaComponent>[] = [];

    formattedDate: string;
    formattedTime: string;
    formattedNextDate: string;
    formattedNextTime: string;
    tz: string;
    showingNow: Showtime;
    showingNext: Showtime;
    countdownMs: number = 0;
    elapsedTimeMs: number = 0;
    defaultPlaylistTitle: string;

    showDemo: boolean = false;

    // NOTE: the broadcast can be reset at any time
    @Input()
    set broadcast(broadcast: IBroadcast) {
        if (this._broadcast === broadcast) { return; }
        this._broadcast = broadcast;
        this.resetFromNewBroadcast();
    }
    get broadcast(): IBroadcast {
        return this._broadcast;
    }

    @Input()
    verbose: boolean = false;

    @Input()
    deltaTMins: number = 0;

    @Output()
    checkUpdates = new EventEmitter();


    dateTime: string;
    screenId: string;
    imageUrl: string;
    wasVerbose: boolean;
    captureOnly: boolean = false;

    private preloadPlaylistSubscription: Subscription;
    private showPlaylistSubscription: Subscription;
    private retirePlaylistSubscription: Subscription;

    @ViewChild(BroadcastInsertDirective, { static: false })
    broadcastInsert: BroadcastInsertDirective;

    @HostListener('document:messageFromHost', ['$event'])
    onAwesomeEvent(ev: CustomEvent) {
        this.logger.debug('CustomEvent: messageFromHost ', ev.detail);
        const data: IDemoInfo = ev.detail;
        this.launchDemo(data);
    }

    constructor(
        private android: AndroidPlatformService,
        private analytics: AnalyticsService,
        private resolver: ComponentFactoryResolver,
        private renderer: Renderer2,
        private cd: ChangeDetectorRef,
        private logger: NGXLogger,
    ) {
        this.engine = new BroadcastEngine(this.android, this.logger);
        this.preloadPlaylistSubscription = this.engine.preloadShow.subscribe(
            (cs: CountedShowtime) => this.onPreloadShow(cs),
            (e: any) => { this.logger.error('onError: ' + e.message); },
            () => { this.logger.log('on complete'); }
        );
        this.showPlaylistSubscription = this.engine.showShow.subscribe(
            (cs: CountedShowtime) => this.onShowShow(cs),
            (e: any) => { this.logger.error('onError: ' + e.message); },
            () => { this.logger.log('on complete'); }
        );
    }

    ngOnInit() {
        this.timer = timer(0, this.TIMER_INTERVAL);
        this.timerSubscription = this.timer.subscribe(
            () => this.tick()
        );

        const eventAwesome = new CustomEvent('awesome', {
            bubbles: true,
            detail: { text: 'foo' }
        });
        document.dispatchEvent(eventAwesome);
    }

    ngOnDestroy(): void {
        this.timerSubscription.unsubscribe();
        this.timerSubscription = undefined;
        this.preloadPlaylistSubscription.unsubscribe();
        this.showPlaylistSubscription.unsubscribe();
        this.retirePlaylistSubscription.unsubscribe();
    }

    onPauseClicked(): void {
        if (!!this.timerSubscription) {
            this.timerSubscription.unsubscribe();
            this.timerSubscription = undefined;
            this.playlistMedia.pause();
        }
    }

    onPlayClicked(): void {
        if (!this.timerSubscription) {
            this.timerSubscription = this.timer.subscribe(
                () => this.tick()
            );
            this.playlistMedia.play();
        }
    }

    onDemoClicked(): void {
        // fake an event that would usually be sent by the Android Layer
        const event = new CustomEvent('messageFromHost', {
            detail: {
                screenId: 'screen_8ca8700e-1ec9-4735-8515-2286eae4b1b7',
                dateTime: '2018-09-12T00:00:00Z',
                imageUrl: 'https://media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/image_ec79e428-e552-4ac4-8c2e-720548121deb.jpg',
                captureOnly: false,
            }
        });
        document.dispatchEvent(event);
    }

    onCaptureClicked(): void {

        // fake an event that would usually be sent by the Android Layer
        const event = new CustomEvent('messageFromHost', {
            detail: {
                screenId: 'screen_8ca8700e-1ec9-4735-8515-2286eae4b1b7',
                dateTime: '2018-09-12T00:00:00Z',
                imageUrl: 'https://media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/image_ec79e428-e552-4ac4-8c2e-720548121deb.jpg',
                captureOnly: true,
            }
        });
        document.dispatchEvent(event);
    }

    private launchDemo(data: IDemoInfo) {
        this.logger.debug('launchDemo()...' + JSON.stringify(data));
        if (!!this.timerSubscription) {
            this.screenId = data.screenId;
            this.dateTime = data.dateTime;
            this.imageUrl = data.imageUrl;
            this.captureOnly = !!data.captureOnly ? data.captureOnly : false;
            this.wasVerbose = this.verbose;
            this.verbose = false;
            if (this.captureOnly) {
                this.logger.debug('launchDemo() captureOnly==true');
            } else {
                this.logger.debug('launchDemo() captureOnly==false');
                this.onPauseClicked();
            }
            setTimeout(() => {
                this.showDemo = true;
                this.cd.detectChanges();
            }, 2000);

        }
    }

    private onDemoDataReady(success: boolean): void {
        if (this.captureOnly && success) { // if captureOnly and data is ready, time to pause the main loop
            this.onPauseClicked();
        }
    }

    private onDemoComplete(): void {
        if (!this.timerSubscription) {
            this.showDemo = false;
            this.onPlayClicked();
            this.verbose = this.wasVerbose;
            this.cd.detectChanges();
        }
    }

    private resetFromNewBroadcast(): void {
        this.broadcastInsert.viewContainerRef.clear();
        this.componentRefQueue = [];
        this.logger.log('subviewsCleared');
        this.engine.runBroadcast(this.broadcast);
        this.tz = this.broadcast.screen.timezone;
        this.tick(); // advance the time
        this.showingNow = this.engine.showingNow;
        this.showingNext = this.engine.showingNext;
        const defaultId = this.broadcast.channel.defaultPlaylistId;
        const defaultPlaylist: IPlaylist = this.broadcast.playlists.find((item) => item.id === defaultId);
        this.defaultPlaylistTitle = !!defaultPlaylist ? defaultPlaylist.title : 'N/A';
    }

    /**
     * periodically called to advance time for all underlying media elements
     * @param override not used
     */
    private tick() {
        const currentTick = moment.tz(this.tz);

        // time shift for debugging
        if (this.deltaTMins > 0) {
            currentTick.add(this.deltaTMins, 'minutes');
        } else if (this.deltaTMins < 0) {
            currentTick.subtract(-this.deltaTMins, 'minutes');
        }

        // display some stats.
        this.formattedDate = currentTick.format('LL');
        this.formattedTime = currentTick.format('LTS');
        this.elapsedTimeMs = (!!this.showingNow) ? currentTick.diff(this.showingNow.at) : 0; // time on this playlist
        this.countdownMs = (!!this.showingNext) ? this.showingNext.at.diff(currentTick) : NaN; // time until next playlist

        // update time on this playlist
        if (!!this.playlistMedia) {
            this.playlistMedia.elapsedTimeMSecs = this.elapsedTimeMs;
        }

        // updated time on engine (which may swap out playlists)
        this.engine.tick(currentTick);

        // check if its time to request broadcast refresh
        if (!this.lastScheduleCheck) {
            this.lastScheduleCheck = currentTick;
        } else if (currentTick.diff(this.lastScheduleCheck) > this.CHECK_INTERVAL) {
            this.lastScheduleCheck = currentTick;
            this.logger.log(this.lastScheduleCheck.format(), ' BroadcastViewerComponent.checkUpdates.emit()');
            this.checkUpdates.emit();
        }
    }

    // pre-create the playlistMedia Component, insert into queue, and make hidden.
    private onPreloadShow(cs: CountedShowtime): void {
        this.showingNext = cs.show;
        if (!cs.show || !cs.show.scheduledContent.playlist) {
            this.analytics.logErrorPlaylistSkipped(cs);
            return;
        }
        this.logger.log('onPreloadShow', cs.show.scheduledContent.id, ' ', cs.show.at.format());
        this.stats('onPreloadShow() begin');
        this.formattedNextDate = cs.show.at.format('LL');
        this.formattedNextTime = cs.show.at.format('LTS Z');
        const componentFactory: ComponentFactory<PlaylistMediaComponent> = this.resolver.resolveComponentFactory(PlaylistMediaComponent);

        const componentRef: ComponentRef<PlaylistMediaComponent> = this.broadcastInsert.viewContainerRef.createComponent(componentFactory); // appends to bottom;
        this.componentRefQueue.push(componentRef);
        this.renderer.setStyle(componentRef.location.nativeElement, 'position', 'absolute');
        this.renderer.setStyle(componentRef.location.nativeElement, 'height', '100%');
        this.renderer.setStyle(componentRef.location.nativeElement, 'width', '100%');

        const playlistMediaComponent: PlaylistMediaComponent = <PlaylistMediaComponent>componentRef.instance;
        playlistMediaComponent.playlist = cs.show.scheduledContent.playlist;
        playlistMediaComponent.tracker = cs.counter;
        playlistMediaComponent.hide();
        this.analytics.logPlaylistQueued(cs);

        this.stats('onPreloadShow() end');
    }

    private onShowShow(cs: CountedShowtime): void {
        // if (this.showingNow !== undefined && this.showingNow !== null) {
        //     this.analytics.logPlaylistTerminated(this.showingNow);
        // }
        this.showingNow = cs.show;
        if (!cs.show || !cs.show.scheduledContent.playlist) {
            this.analytics.logErrorPlaylistSkipped(cs);
            return;
        }
        this.logger.log('onShowShow', cs.show.scheduledContent.playlist);
        this.stats('onShowShow() begin');

        // pop items off the queue until getting a matching showId or its the last item.
        while (this.componentRefQueue.length > 1 &&
            (<PlaylistMediaComponent>this.componentRefQueue[0].instance).playlist.id !== cs.show.scheduledContent.playlistId &&
            (<PlaylistMediaComponent>this.componentRefQueue[0].instance).tracker !== cs.counter) {
            this.componentRefQueue.shift();
            this.broadcastInsert.viewContainerRef.remove(0);
            this.stats('onShowShow() while...');
        }
        this.playlistMedia = <PlaylistMediaComponent>this.componentRefQueue[0].instance;
        this.playlistMedia.show();
        this.playlistMedia.play();
        this.analytics.logPlaylistStarted(cs);
        this.stats('onShowShow() end...');
    }

    private stats(msg: string) {
        this.logger.log(msg, ':  #components=', this.componentRefQueue.length,
            '   #DOMElements=', this.broadcastInsert.viewContainerRef.length);
    }
}
