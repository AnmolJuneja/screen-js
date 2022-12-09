import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class AddulateBaseService {

    protected addulateHeaders(perms: { token: string, acting: string }): HttpHeaders {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', 'Bearer ' + perms.token);
        if (!!perms.acting) {
            headers = headers.set('X-Addulate-Account', perms.acting);
        }
        return headers;
    }

}
