import { Component, OnInit, Input } from '@angular/core';

import { IPlaylistItem } from '../models/playlistitem.model';
import { IUrl } from 'app/models/url.model';

@Component({
    selector: 'app-url-viewer',
    templateUrl: './url-viewer.component.html',
    styleUrls: ['./url-viewer.component.css']
})
export class UrlViewerComponent implements OnInit {

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

    constructor() { }

    ngOnInit() {
        const w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            width = w.innerWidth || e.clientWidth || g.clientWidth,
            height = w.innerHeight || e.clientHeight || g.clientHeight;
        if (this.width <= 0) {
            this.width = width;
        }
        if (this.height <= 0) {
            this.height = height;
        }
    }
}
