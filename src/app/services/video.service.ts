import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AddulateBaseService } from './addulate-base.service';
import { IVideo } from '../models/video.model';
import { environment } from '../../environments/environment';

@Injectable()
export class VideoService extends AddulateBaseService {

    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    getById(id: string, perms: { token: string, acting: string }): Observable<IVideo> {
        const url: string = environment.endpoint + '/videos/' + id;
        return this.http.get<IVideo>(url, { headers: this.addulateHeaders(perms) });
    }
}
