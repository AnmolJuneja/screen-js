import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

import { NGXLogger } from 'ngx-logger';
import { AnalyticsService } from '../services/analytics.service';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) { }

    handleError(error) {
        const logger = this.injector.get(NGXLogger);
        const location = this.injector.get(LocationStrategy);
        const analytics = this.injector.get(AnalyticsService);

        const message: string = error.message ? error.message : error.toString();

        const url: string = location instanceof PathLocationStrategy ? location.path() : '';

        // get the stack trace, lets grab the last 10 stacks only
        StackTrace.fromError(error).then(stackframes => {
            const stackString = stackframes
                .splice(0, 20)
                .map(function (sf) {
                    return sf.toString();
                }).join('\n');

            logger.warn(message);
            logger.warn(stackString);
            analytics.logGlobalError(message, url, stackString);
            throw error;
        });
    }

}
