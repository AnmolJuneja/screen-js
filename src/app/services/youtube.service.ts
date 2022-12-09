
import {of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';


import { AddulateBaseService } from './addulate-base.service';
import { IYoutube } from '../models/youtube.model';
import { environment } from '../../environments/environment';

@Injectable()
export class YoutubeService extends AddulateBaseService {

    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    getById(id: string, perms: { token: string, acting: string }): Observable<IYoutube> {
        /*
        const url: string = environment.endpoint + '/videos/' + id;
        return this.http.get<IYouTube>(url, { headers: this.addulateHeaders(perms) });
        */
        const sample: IYoutube = <IYoutube>{
            id: 'youtube_xyz',
            title: 'Sample Youtube',
            description: 'This will come from REST API later',
            videoID: '1cH2cerUpMQ',
        };
        return observableOf(sample);
    }
}
