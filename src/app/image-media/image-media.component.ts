import { Component, Input } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';

import { NGXLogger } from 'ngx-logger';

import { IImage } from '../models/image.model';
import { IPlaylistItem } from '../models/playlistitem.model';
import { ContentMediaComponent } from 'app/content-media/content-media.component';
import { AnalyticsService } from 'app/services/analytics.service';

@Component({
    selector: 'app-image-media',
    templateUrl: './image-media.component.html',
    styleUrls: ['./image-media.component.css'],
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
export class ImageMediaComponent extends ContentMediaComponent {
    private image: IImage;
    private _playlistItem: IPlaylistItem;

    @Input()
    verbose: boolean;

    src: string = 'http://bodyhacks.com/wp-content/uploads/2016/08/l.jpg';
    alt: string = 'default image';
    id: string;
    elem: any;

    get title(): string {
        return this.image ? this.image.title : 'unknown';
    }

    set playlistItem(playlistItem: IPlaylistItem) {
        if (this._playlistItem === playlistItem) { return; }
        if (playlistItem.itemType !== 'image') {
            this.logger.error('ImageMediaComponent: invalid playlistItem type ', playlistItem.itemType);
        }
        this._playlistItem = playlistItem;
        this.durationMSecs = playlistItem.durationSecs * 1000;
        if (!!playlistItem.item) {
            this.image = <IImage>playlistItem.item;
            this.src = this.image.imageUrl;
            this.alt = this.image.title;
        }
    }

    constructor(
        private analytics: AnalyticsService,
        private logger: NGXLogger,
    ) {
        super();
    }

    async load(): Promise<boolean> {
        await super.play();
        return Promise.resolve(true);
    }

    async play(): Promise<boolean> {
        await super.play();
        this.playing.emit();
        return Promise.resolve(true);
    }

    pause(): void {
        super.pause();
        this.paused.emit();
    }

    complete(): void {
        super.complete();
        this.analytics.logImageShown(this._playlistItem);
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

}
