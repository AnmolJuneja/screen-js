import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnalyticsService } from 'app/services/analytics.service';

/**
 * Base class for various Loader classes
 */
@Component({
    selector: 'app-content-loader',
    templateUrl: './content-loader.component.html',
    styleUrls: ['./content-loader.component.css']
})
export class ContentLoaderComponent implements OnInit, OnDestroy {

    protected queryParamSubscription: Subscription;
    protected paramSubscription: Subscription;
    protected startTime: Date = new Date();
    protected id: string;
    public verbose: boolean = false;
    token: string;
    acting: string;
    log: string[] = ['0.000 starting...'];

    constructor(
        protected route: ActivatedRoute,
        protected analytics: AnalyticsService
    ) { }

    ngOnInit() {
        this.queryParamSubscription = this.route.queryParams.subscribe((params: Params) => {
            this.setQueryParams(params);
        });

        this.paramSubscription = this.route.params.subscribe((params: Params) => {
            this.setParams(params);
        });
    }

    ngOnDestroy() {
        this.queryParamSubscription.unsubscribe();
        this.paramSubscription.unsubscribe();
    }

    setParams(params: Params) {
        if (!!params && !!params.id) {
            this.id = params.id;
            this.analytics.logScreenID(this.id);
        }
    }

    setQueryParams(params: Params) {
        if (!!params && !!params.v) {  // turn on verbosity
            this.verbose = params.v !== '0';
        }
        if (!!params && !!params.a) { // pass through acting account (used for previewing)
            this.acting = params.a;
        }
        if (!!params && !!params.t) { // pass through token (needed for previewing)
            this.token = params.t;
        }
        if (!!params && !!params.i) {
            this.analytics.setUniqueId(params.i);
        } else if (!!params && !!params.adid) {
            this.analytics.setUniqueId(params.adid);
        }
        this.analytics.appLaunch();
    }

    protected elapsedTime(): number {
        const elapsedMs: number = new Date().valueOf() - this.startTime.valueOf();
        return elapsedMs / 1000;
    }
}
