import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { IImage } from '../models/image.model';
import { ImageService } from '../services/image.service';
import { AnalyticsService } from '../services/analytics.service';
import { ContentLoaderComponent } from '../content-loader/content-loader.component';

@Component({
    selector: 'app-image-loader',
    templateUrl: './image-loader.component.html',
    styleUrls: ['./image-loader.component.css']
})
export class ImageLoaderComponent extends ContentLoaderComponent {

    image: IImage;

    constructor(
        private imageService: ImageService,
        protected route: ActivatedRoute,
        protected analytics: AnalyticsService
    ) {
        super(route, analytics);
    }


    setParams(params: Params) {
        super.setParams(params);
        this.loadImage();
    }

    setQueryParams(params: Params) {
        super.setQueryParams(params);

        if (this.token) {
            this.loadImage();
        } else {
            this.log.push(this.elapsedTime() + ' failed: insufficent permissions.');
        }
    }

    private loadImage() {
        if (!this.token || !this.id) {
            return;
        }
        this.log.push(this.elapsedTime() + ' loading data...');
        this.imageService.getById(this.id, { token: this.token, acting: this.acting }).subscribe(
            (image: IImage) => {
                this.log.push(this.elapsedTime() + ' data loaded');
                this.image = image;
            },
            (error: any) => {
                this.log.push(this.elapsedTime() + ' ' + error.message);
            },
            () => {

            }
        );
    }
}
