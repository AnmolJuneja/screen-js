import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timer, of } from 'rxjs';
import { map, mergeMap, retryWhen, catchError, finalize } from 'rxjs/operators';
import { environment } from 'environments/environment.test';

export const genericRetryStrategy = ({
    maxRetryAttempts = 4,
    scalingDuration = 1000,
    excludedStatusCodes = []
}: {
        maxRetryAttempts?: number,
        scalingDuration?: number,
        excludedStatusCodes?: number[]
    } = {}) => (attempts: Observable<any>) => {
        return attempts.pipe(
            mergeMap((error, i) => {
                const retryAttempt = i + 1;
                // if maximum number of retries have been met
                // or response is a status code we don't wish to retry, throw error
                if (
                    retryAttempt > maxRetryAttempts ||
                    excludedStatusCodes.find(e => e === error.status)
                ) {
                    return throwError(error);
                }
                console.log(
                    `Attempt ${retryAttempt}: retrying in ${retryAttempt *
                    scalingDuration}ms`
                );
                // retry after 1s, 2s, etc...
                return timer(retryAttempt * scalingDuration);
            }),
            finalize(() => console.log('We are done!'))
        );
    };

@Injectable({
    providedIn: 'root'
})
export class ComputerVisionService {

    constructor(
        private http: HttpClient,
    ) {
    }

    getCount(screenId: string, dateTime: string): Observable<any> {
        const url: string = environment.apiGateway + '/cvv1/screen/' + screenId;
        return this.http.get<any>(url).pipe(
            map((value: any) => {
                if (value['Count'] < 0) {
                    throw value;
                } else if (value['Items'][0]['dateTime'] < dateTime) {
                    throw value;
                } else {
                    return value; // <----- NOTE "return" not "throw"
                }
            }),
            retryWhen(genericRetryStrategy()),
        );
    }
}
