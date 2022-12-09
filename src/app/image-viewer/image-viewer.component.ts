import { Component, OnInit, Input } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, empty } from 'rxjs';

import { IImage } from '../models/image.model';
import { IPlaylistItem } from '../models/playlistitem.model';
import { AnalyticsService } from '../services/analytics.service';

@Component({
    selector: 'app-image-viewer',
    templateUrl: 'image-viewer.component.html',
    styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent implements OnInit {

    private _image: IImage;

    @Input()
    verbose: boolean;

    @Input()
    item: IPlaylistItem;

    @Input()
    index: number;

    @Input()
    showing: boolean;

    @Input()
    set image(image: IImage) {
        this._image = image;
        this.title = this.image ? this.image.title : 'unknown';
        this.src = this.image ? this.image.imageUrl : '';
    }
    get image(): IImage {
        return this._image;
    }

    src: string;
    title: string;

    constructor(
        private analytics: AnalyticsService
    ) { }

    ngOnInit() {
        if (!this.image && !!this.item) {
            this.image = this.item.item as IImage;
        }
    }

    ///////  Slide View Delegate Methods

    prefetch<T>(): Observable<HttpResponse<T>> {
        return empty();
    }

    play() {
    }

    pause() {
    }

    resume() {
    }

    interrupt() {
    }

    complete() {
        this.analytics.logImageShown(this.item);
    }
}
