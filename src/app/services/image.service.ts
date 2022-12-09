import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AddulateBaseService } from './addulate-base.service';
import { IImage } from '../models/image.model';
import { environment } from '../../environments/environment';

@Injectable()
export class ImageService extends AddulateBaseService {

    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    getById(id: string, perms: { token: string, acting: string }): Observable<IImage> {
        const url: string = environment.endpoint + '/images/' + id;
        return this.http.get<IImage>(url, { headers: this.addulateHeaders(perms) });
    }
}
