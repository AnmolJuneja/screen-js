

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, empty } from 'rxjs';
import { retry } from 'rxjs/operators';

import { NGXLogger } from 'ngx-logger';

import { environment } from '../../environments/environment';
import { IAnalyticsVendor } from './analytics.service';

@Injectable({
    providedIn: 'root',  // singleton service.
})
export class MixpanelService implements IAnalyticsVendor {

    private readonly EVENT_ENDPOINT = 'https://api.mixpanel.com/track';
    private readonly PROFILE_ENDPOINT = 'https://api.mixpanel.com/engage';

    private token: string = environment.mixpanel_token;
    private distinct_id: string = undefined;
    private ip: boolean = false;
    private redirect: string = undefined;
    private img: boolean = false;
    private callback: string = undefined;
    private verbose: boolean = false;
    private test: boolean = false;
    private backlog: string[] = [];

    constructor(
        private http: HttpClient,
        private logger: NGXLogger,
    ) {

    }

    public setVendorSpecific(obj: any): any {
        for (const key of Object.keys(obj)) {
            switch (key) {
                case 'token': {
                    this.token = obj.token;
                    break;
                }
                case 'distinct_id': {
                    this.distinct_id = obj.distinct_id;
                    break;
                }
                case 'ip': {
                    this.ip = obj.ip;
                    break;
                }
                case 'redirect': {
                    this.redirect = obj.redirect;
                    break;
                }
                case 'img': {
                    this.img = obj.img;
                    break;
                }
                case 'callback': {
                    this.callback = obj.callback;
                    break;
                }
                case 'verbose': {
                    this.verbose = obj.verbose;
                    break;
                }
                case 'test': {
                    this.test = obj.test;
                    break;
                }
                default: {
                    return { notfound: true };
                }
            }
            return undefined;
        }
        return { empty: true };
    }

    public setUniqueId(uniqueId: string) {
        this.distinct_id = uniqueId;
    }

    public sendEvent(name: string, data: any): void {
        data['time'] = Date.now();
        const base64encoded = this.encodePayload(name, data);
        const params = this.payloadToHttpParams(base64encoded);
        if (this.test || !this.distinct_id) {
            // this.logger.log(this.EVENT_ENDPOINT, 'GET', params);
            return;
        }
        this.http.get<Number>(this.EVENT_ENDPOINT, { params: params })
            .pipe(
                retry(3)
            )
            .subscribe(
                (resp) => {
                    if (resp === 1) {
                        this.drainBacklog();
                    } else {
                        this.logger.error('Mixpanel error: %i', resp);
                    }
                },
                (err) => {
                    this.logger.warn('Warning: could not send analytics event ' + name + '. Caching for later.');
                    this.addBacklog(base64encoded);
                }
            );
    }

    private encodePayload(name: string, data: any): string {

        const message = {
            event: name,
            properties: data
        };
        message.properties.token = this.token;
        message.properties.distinct_id = this.distinct_id;

        const formattedData = btoa(JSON.stringify(message)); // base64 encode
        return formattedData;
    }


    private payloadToHttpParams(data: string): HttpParams {
        let params = new HttpParams();
        params = params.set('data', data);
        if (this.ip) {
            params = params.set('ip', '1');
        }
        if (!!this.redirect) {
            params = params.set('redirect', this.redirect);
        }
        if (this.img) {
            params = params.set('img', '1');
        }
        if (!!this.callback) {
            params = params.set('callback', this.callback);
        }
        if (this.verbose) {
            params = params.set('verbose', '1');
        }
        return params;
    }

    private drainBacklog() {
        this.backlog.forEach((data: string, index: number) => {
            const params = this.payloadToHttpParams(data);
            this.http.get(this.EVENT_ENDPOINT, { params: params }).pipe(
                retry(3))
                .subscribe();
        });
        this.backlog = [];
    }

    private addBacklog(data: string) {
        this.backlog.push(data);
    }
}
