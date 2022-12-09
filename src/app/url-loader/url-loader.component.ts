import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UrlService } from '../services/url.service';
import { AnalyticsService } from '../services/analytics.service';
import { ContentLoaderComponent } from '../content-loader/content-loader.component';
import { IUrl } from 'app/models/url.model';

@Component({
    selector: 'app-url-loader',
    templateUrl: './url-loader.component.html',
    styleUrls: ['./url-loader.component.css']
})
export class UrlLoaderComponent extends ContentLoaderComponent {

    urlItem: IUrl;
    src: string;
    width: number = -1;
    height: number = -1;

    constructor(
        private urlService: UrlService,
        protected route: ActivatedRoute,
        protected analytics: AnalyticsService
    ) {
        super(route, analytics);
    }

    setParams(params: Params) {
        super.setParams(params);
        this.loadUrl();
    }

    setQueryParams(params: Params) {
        super.setQueryParams(params);

        if (this.token) {
            this.loadUrl();
        } else {
            this.log.push(this.elapsedTime() + ' failed: insufficent permissions.');
        }
    }

    private loadUrl() {
        if (!this.token || !this.id) {
            return;
        }
        this.log.push(this.elapsedTime() + ' loading data...');
        this.urlService.getById(this.id, { token: this.token, acting: this.acting }).subscribe(
            (url: IUrl) => {
                this.log.push(this.elapsedTime() + ' data loaded');
                this.urlItem = url;
            },
            (error: any) => {
                this.log.push(this.elapsedTime() + ' ' + error.message);
            },
            () => {

            }
        );
    }
}
