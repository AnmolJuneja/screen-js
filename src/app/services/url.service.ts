import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AddulateBaseService } from './addulate-base.service';
import { IUrl } from '../models/url.model';
import { environment } from '../../environments/environment';

@Injectable()
export class UrlService extends AddulateBaseService {

    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    getById(id: string, perms: { token: string, acting: string }): Observable<IUrl> {
        return of(<IUrl>{
            id: 'url_xyz',
            title: 'sample url',
            description: 'a simple one for development',
            src: 'https://trivalleywriters.org',
            createdAt: 'date',
            updatedAt: 'date',
            creatorId: 'user_xyz',
            accountId: 'account_123'
        });
    }

    // getById(id: string, perms: { token: string, acting: string }): Observable<IUrl> {
    //     const url: string = environment.endpoint + '/urls/' + id;
    //     return this.http.get<IUrl>(url, { headers: this.addulateHeaders(perms) });
    // }
}
