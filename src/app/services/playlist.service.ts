import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AddulateBaseService } from './addulate-base.service';
import { IPlaylist } from '../models/playlist.model';
import { environment } from '../../environments/environment';

@Injectable()
export class PlaylistService extends AddulateBaseService {

    get params(): HttpParams {
        return new HttpParams().set('expand', 'items');
    }

    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    getById(id: string, perms: { token: string, acting: string }): Observable<IPlaylist> {
        const url: string = environment.endpoint + '/playlists/' + id;
        return this.http.get<IPlaylist>(url, { headers: this.addulateHeaders(perms), params: this.params });
    }

}
