import { Component, OnInit, AfterViewInit, DoCheck, Input, ViewChild, ComponentFactoryResolver, Renderer2, ComponentRef } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';

import { NGXLogger } from 'ngx-logger';

import { IPlaylist } from '../models/playlist.model';
import { IPlaylistItem } from '../models/playlistitem.model';
import { PlaylistInsertDirective } from 'app/playlist-insert.directive';
import { ImageMediaComponent } from 'app/image-media/image-media.component';
import { VideoMediaComponent } from 'app/video-media/video-media.component';
import { ContentMediaComponent } from 'app/content-media/content-media.component';
import { UrlMediaComponent } from 'app/url-media/url-media.component';
import { AnalyticsService } from 'app/services/analytics.service';
import { WidgetMediaComponent } from 'app/widget-media/widget-media.component';


//
// Displays playlist based on elapsed time
//
@Component({
    selector: 'app-playlist-media',
    templateUrl: './playlist-media.component.html',
    styleUrls: ['./playlist-media.component.css'],
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
export class PlaylistMediaComponent extends ContentMediaComponent implements OnInit, AfterViewInit, DoCheck {
    private _playlist: IPlaylist;
    private currentSlideIndex: number = NaN;
    private cumulativeEndTimes: number[] = []; // indexed by slide#
    private componentRefs: ComponentRef<ContentMediaComponent>[] = []; // indexed by slide#

    visualState: string = 'hidden';
    tracker: number = 0; // used to disambiguation multiple instances with same playlistId. (e.g. playlist updates)
    hasInited: boolean = false;
    needsPlaylistUpdate: boolean = false;

    @ViewChild(PlaylistInsertDirective, { static: false })
    playlistInsert: PlaylistInsertDirective;

    @Input()
    hideByDefault: boolean = true;

    @Input()
    set playlist(playlist: IPlaylist) {
        if (this._playlist === playlist) { return; }
        this._playlist = playlist;
        this.durationMSecs = playlist.durationSecs * 1000;
        this.needsPlaylistUpdate = true;
    }

    get playlist(): IPlaylist {
        return this._playlist;
    }

    @Input()
    set elapsedTimeMSecs(elapsedTimeMSecs: number) {
        this.setElapsedMSecs(elapsedTimeMSecs);
    }

    constructor(
        private componentFactory: ComponentFactoryResolver,
        private renderer: Renderer2,
        private logger: NGXLogger,
        private analytics: AnalyticsService,
    ) {
        super();
    }

    ngOnInit() {
        if (!this.hideByDefault) {
            this.show();
            this.play();
        }
    }

    ngAfterViewInit() {
        this.hasInited = true;
    }

    ngDoCheck() {
        if (this.hasInited && this.needsPlaylistUpdate) {
            this.needsPlaylistUpdate = false;
            this.resetFromNewPlaylist();
        }
    }

    // Content Media Component overrides

    async load(): Promise<boolean> {
        return Promise.resolve(true);
    }

    async play(): Promise<boolean> {
        await super.play();
        if (!isNaN(this.currentSlideIndex)) {
            return this.componentRefs[this.currentSlideIndex].instance.play();
        } else {
            return Promise.resolve(false);
        }
    }

    pause() {
        super.pause();
        if (!isNaN(this.currentSlideIndex)) {
            this.componentRefs[this.currentSlideIndex].instance.pause();
        }
    }

    setElapsedMSecs(elapsedTimeMSecs: number) {
        super.setElapsedMSecs(elapsedTimeMSecs); // updates ContentMedia.effectiveMSecs & lapcounter
        this.checkAdvanceSlide();
        if (!isNaN(this.currentSlideIndex)) {
            const mSecAtSlideStart: number = (this.currentSlideIndex === 0) ? 0 : (this.cumulativeEndTimes[this.currentSlideIndex - 1] * 1000);
            let mSecForThisSlide = this.mSecsThisLap - mSecAtSlideStart;
            if (mSecForThisSlide < 0 && mSecForThisSlide > -250) { // allow for a 1/4 second of slop
                mSecForThisSlide = 0;
            }
            if (mSecForThisSlide < 0) {
                this.logger.error('Timing Error: ', elapsedTimeMSecs, '=?', this.lapCounter, '*', this.durationMSecs,
                    '+', mSecAtSlideStart, '; ', mSecForThisSlide, '=', mSecAtSlideStart, '+', this.mSecsThisLap, ', no negative numbers');
            } else if (this.currentSlideIndex < this.componentRefs.length) {
                this.componentRefs[this.currentSlideIndex].instance.setElapsedMSecs(mSecForThisSlide);
            } else {
                this.logger.warn('Cannot change to slide #', this.currentSlideIndex,
                    ' when current list only has ', this.componentRefs.length);
            }
            // this.logger.debug('Playlist Elapsed Time ', (elapsedTimeMSecs / 1000),
            //     '-- lap=', this.lapCounter,
            //     ' effective_t(playlist)=', this.mSecsThisLap / 1000,
            //     ' slide#=', this.currentSlideIndex,
            //     ' position=', this.playlist.items[this.currentSlideIndex].position,
            //     ' effective_t(playlistitem)=', (this.mSecsThisLap - delta) / 1000);
        }
    }

    // internal implementations

    private resetFromNewPlaylist(): void {
        const endTimeSecs: number[] = this.playlist.items.map((item: IPlaylistItem) => {
            return item.durationSecs;
        });

        this.cumulativeEndTimes = endTimeSecs.reduce((c, v, i) => [...c, v + (i === 0 ? 0 : c[i - 1])], []);

        const viewContainerRef = this.playlistInsert.viewContainerRef;
        viewContainerRef.clear();

        this.componentRefs = this.playlist.items.map((item: IPlaylistItem) => {
            if (item.itemType === 'image') {
                const componentFactory = this.componentFactory.resolveComponentFactory(ImageMediaComponent);
                const newComponent = viewContainerRef.createComponent(componentFactory);
                newComponent.instance.hide();
                newComponent.instance.playlistItem = item;
                this.renderer.setStyle(newComponent.location.nativeElement, 'position', 'absolute');
                this.renderer.setStyle(newComponent.location.nativeElement, 'height', 'inherit');
                this.renderer.setStyle(newComponent.location.nativeElement, 'width', 'inherit');
                // newComponent.instance.pause();
                // newComponent.instance.reset();
                return newComponent;
            } else if (item.itemType === 'video') {
                const componentFactory = this.componentFactory.resolveComponentFactory(VideoMediaComponent);
                const newComponent = viewContainerRef.createComponent(componentFactory);
                newComponent.instance.hide();
                newComponent.instance.playlistItem = item;
                this.renderer.setStyle(newComponent.location.nativeElement, 'position', 'absolute');
                this.renderer.setStyle(newComponent.location.nativeElement, 'height', 'inherit');
                this.renderer.setStyle(newComponent.location.nativeElement, 'width', 'inherit');
                // newComponent.instance.pause();
                // newComponent.instance.reset();
                return newComponent;
            } else if (item.itemType === 'url') {
                const componentFactory = this.componentFactory.resolveComponentFactory(UrlMediaComponent);
                const newComponent = viewContainerRef.createComponent(componentFactory);
                newComponent.instance.hide();
                newComponent.instance.playlistItem = item;
                this.renderer.setStyle(newComponent.location.nativeElement, 'position', 'absolute');
                this.renderer.setStyle(newComponent.location.nativeElement, 'height', 'inherit');
                this.renderer.setStyle(newComponent.location.nativeElement, 'width', 'inherit');
                // newComponent.instance.pause();
                // newComponent.instance.reset();
                return newComponent;
            } else if (item.itemType === 'widget') {
                const componentFactory = this.componentFactory.resolveComponentFactory(WidgetMediaComponent);
                const newComponent = viewContainerRef.createComponent(componentFactory);
                newComponent.instance.hide();
                newComponent.instance.playlistItem = item;
                this.renderer.setStyle(newComponent.location.nativeElement, 'position', 'absolute');
                this.renderer.setStyle(newComponent.location.nativeElement, 'height', 'inherit');
                this.renderer.setStyle(newComponent.location.nativeElement, 'width', 'inherit');
                // newComponent.instance.pause();
                // newComponent.instance.reset();
                return newComponent;
            }
            return null;
        });
    }

    private checkAdvanceSlide() {
        const nextSlideIndex: number = this.cumulativeEndTimes.findIndex(v => v >= (this.mSecsThisLap / 1000));
        if (nextSlideIndex === -1) { // its about to fire complete
            return;
        }
        if (Number.isNaN(this.currentSlideIndex) || this.currentSlideIndex !== nextSlideIndex) {
            this.switchFromTo(this.currentSlideIndex, nextSlideIndex);
        }
    }

    private async switchFromTo(previousIndex: number, nextIndex: number) {
        if (previousIndex === (this.playlist.items.length - 1) && nextIndex === 0) {
            this.analytics.logPlaylistRepeat(this.playlist);
        }
        if (this.componentRefs && this.componentRefs.length > 0) {
            if (!Number.isNaN(nextIndex)) {
                await this.componentRefs[nextIndex].instance.play();
                this.componentRefs[nextIndex].instance.show();
            }
            this.currentSlideIndex = nextIndex;
            if (!Number.isNaN(previousIndex)) {
                this.componentRefs[previousIndex].instance.complete();
                this.componentRefs[previousIndex].instance.hide();
                this.componentRefs[previousIndex].instance.pause();
                // reset video after it's faded out.
                setTimeout(() => this.componentRefs[previousIndex].instance.reset(), 500);
            }
        } else {
            this.currentSlideIndex = nextIndex;
        }
    }

}
