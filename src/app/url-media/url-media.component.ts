import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';

import { NGXLogger } from 'ngx-logger';

import { IPlaylistItem } from '../models/playlistitem.model';
import { IUrl } from 'app/models/url.model';
import { ContentMediaComponent } from 'app/content-media/content-media.component';
import { AnalyticsService } from 'app/services/analytics.service';

@Component({
    selector: 'app-url-media',
    templateUrl: './url-media.component.html',
    styleUrls: ['./url-media.component.css'],
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
export class UrlMediaComponent extends ContentMediaComponent implements OnInit {
    private _playlistItem: IPlaylistItem;

    @ViewChild('myIFrame', { static: false, read: ElementRef }) iFrameElt: ElementRef;

    @Input()
    width; number = -1; // default to screen size

    @Input()
    height: number = -1; // default to screen size

    @Input()
    item: IPlaylistItem;

    @Input()
    index: number;

    @Input()
    showing: boolean;

    @Input()
    verbose: boolean;

    @Input()
    urlItem: IUrl;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.resizeIFrame();
    }

    set playlistItem(playlistItem: IPlaylistItem) {
        if (this._playlistItem === playlistItem) { return; }
        if (playlistItem.itemType !== 'url') {
            this.logger.error('ImageMediaComponent: invalid playlistItem type ', playlistItem.itemType);
        }
        this._playlistItem = playlistItem;
        this.durationMSecs = playlistItem.durationSecs * 1000;
        if (!!playlistItem.item) {
            this.urlItem = <IUrl>playlistItem.item;
        }
    }

    constructor(
        private analytics: AnalyticsService,
        private logger: NGXLogger,
    ) {
        super();
    }


    ngOnInit() {
        this.resizeIFrame();
    }

    async load(): Promise<boolean> {
        return Promise.resolve(true);
    }

    async play(): Promise<boolean> {
        super.play();
        // this.enableWebkitAnimations(this.iFrameElt);
        // this.playElementTypes(this.iFrameElt, 'audio');
        // this.playElementTypes(this.iFrameElt, 'video');
        this.playing.emit();
        return Promise.resolve(true);
    }

    pause(): void {
        super.pause();
        // this.disableWebkitAnimations(this.iFrameElt);
        // this.pauseElementTypes(this.iFrameElt, 'audio');
        // this.pauseElementTypes(this.iFrameElt, 'video');
        this.paused.emit();
    }

    complete(): void {
        super.complete();
        // TODO: add analytics
        // this.analytics.logUrlShown(this._playlistItem);
    }

    reset(): void {
        super.reset();
    }

    onContentLoaded(): void {
        this.loaded.emit(1.0);
    }

    onComplete() {
        this.ended.emit();
    }

    private resizeIFrame() {
        const w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            width = w.innerWidth || e.clientWidth || g.clientWidth,
            height = w.innerHeight || e.clientHeight || g.clientHeight;
        if (!this.width || this.width <= 0) {
            this.width = width;
        }
        if (!this.height || this.height <= 0) {
            this.height = height;
        }
    }

    private disableWebkitAnimations(root: ElementRef) {
        root.nativeElement.querySelectorAll('*').forEach(element => {
            element.style.disableWebkitAnimations();
        });
    }

    private enableWebkitAnimations(root: ElementRef) {
        root.nativeElement.querySelectorAll('*').forEach(element => {
            element.style.enableWebkitAnimations();
        });
    }

    private pauseElementTypes(root: ElementRef, typeName: string) {
        root.nativeElement.querySelectorAll(typeName).forEach(element => {
            element.pause();
        });
    }
    private playElementTypes(root: ElementRef, typeName: string) {
        root.nativeElement.querySelectorAll(typeName).forEach(element => {
            element.play();
        });
    }
}
