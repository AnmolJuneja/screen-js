import {
    Component,
    OnInit,
    ViewChildren,
    ViewChild,
    ElementRef,
    ComponentFactoryResolver,
    Injector,
    ComponentFactory,
    ViewContainerRef,
    AfterViewInit,
    Renderer2
} from '@angular/core';
import { ContentMediaComponent } from 'app/content-media/content-media.component';
import {
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/animations';
import { IPlaylistItem } from 'app/models/playlistitem.model';
import { IUrl } from 'app/models/url.model';
import { AnalyticsService } from 'app/services/analytics.service';
import { NGXLogger } from 'ngx-logger';
import { IWidget } from 'app/models/widget.model';
import { WidgetService } from 'app/services/widget.service';
import { flatMap } from 'rxjs/operators';
import { Subscription, concat } from 'rxjs';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-widget-media',
    templateUrl: './widget-media.component.html',
    styleUrls: ['./widget-media.component.css'],
    animations: [
        trigger('fade', [
            state('void', style({ opacity: 0 })),
            state('hidden', style({ opacity: 0 })),
            state('showing', style({ opacity: 1 })),
            transition('hidden <=> showing', [animate(1000)]),
            transition('void <=> showing', [animate(1000)])
        ])
    ]
})
export class WidgetMediaComponent extends ContentMediaComponent implements AfterViewInit {

    @ViewChild('banner', { static: true })
    banner: ElementRef<HTMLDivElement>;


    payloadString: string;
    dependancySubscription: Subscription;
    ready = false;

    webObjectRegistry = [
        {
            widgetType: 'twitter',
            scriptsUrl: `${environment.widgetEndpoint}/twitter/twitter-widgets-es5.js`,
            styleUrl: `${environment.widgetEndpoint}/twitter/styles.css`,
            elementName: 'twitter-viewer'
        },
        {
            widgetType: 'gdraw',
            scriptsUrl: `${environment.widgetEndpoint}/gdrive/gdrive-widgets-es5.js`,
            styleUrl: `${environment.widgetEndpoint}/gdrive/styles.css`,
            elementName: 'gdraw-viewer'
        },
        {
            widgetType: 'gfolder',
            scriptsUrl: `${environment.widgetEndpoint}/gdrive/gdrive-widgets-es5.js`,
            styleUrl: `${environment.widgetEndpoint}/gdrive/styles.css`,
            elementName: 'gdrive-folder-viewer'
        },
        {
            widgetType: 'gslide',
            scriptsUrl: `${environment.widgetEndpoint}/gdrive/gdrive-widgets-es5.js`,
            styleUrl: `${environment.widgetEndpoint}/gdrive/gstyles.css`,
            elementName: 'gslides-viewer'
        },
        {
            widgetType: 'facebook',
            scriptsUrl: `${environment.widgetEndpoint}/facebook/facebook-widgets-es5.js`,
            styleUrl: `${environment.widgetEndpoint}/facebook/styles.css`,
            elementName: 'facebook-viewer-widget'
        }
    ];

    private _playlistItem: IPlaylistItem;
    private widget: IWidget;

    constructor(
        private analytics: AnalyticsService,
        private logger: NGXLogger,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private viewContainerRef: ViewContainerRef,
        private widgetService: WidgetService,
        private renderer2: Renderer2
    ) {
        super();
    }

    set playlistItem(playlistItem: IPlaylistItem) {
        console.log('WidgetMediaComponent playlistItem', playlistItem);
        if (this._playlistItem === playlistItem) {
            return;
        }
        if (playlistItem.itemType !== 'widget') {
            this.logger.error(
                'ImageMediaComponent: invalid playlistItem type ',
                playlistItem.itemType
            );
        }
        this._playlistItem = playlistItem;
        this.durationMSecs = playlistItem.durationSecs * 1000;
        if (!!playlistItem.item) {
            this.widget = <IWidget>playlistItem.item;
        }
    }

    async load(): Promise<boolean> {
        await super.play();
        return Promise.resolve(true);
    }

    async play(): Promise<boolean> {
        await super.play();
        this.playing.emit();
        return Promise.resolve(true);
    }

    pause(): void {
        super.pause();
        this.paused.emit();
    }

    complete(): void {
        super.complete();
        this.analytics.logImageShown(this._playlistItem);
    }

    reset(): void {
        super.reset();
    }

    onContentLoaded(): void {
        this.loaded.emit(1.0);
    }

    onComplete() {
        this.ended.emit();
    }

    ngAfterViewInit(): void {
        if (this.dependancySubscription) {
            this.dependancySubscription.unsubscribe();
        }
        if (!this.widget) {
            return;
        }
        const entry = this.webObjectRegistry.find(x => x.widgetType === this.widget.type);
        if (entry) {
            this.dependancySubscription = concat(
                // load the widget script
                this.widgetService.loadWidgetScript(entry.scriptsUrl),
                // load the script styles
                this.widgetService.loadWidgetStyles(entry.styleUrl)
            ).subscribe(() => {
            }, (err) => {
                console.log('dependancySubscription err', err);
            }, () => {
                this.ready = true;
                const el = this.renderer2.createElement(entry.elementName);
                // for (const key in this.widget.payload) {
                //     if (this.widget.payload.hasOwnProperty(key)) {
                //         const value = this.widget.payload[key];
                //         el.setAttribute(key, value);
                //     }
                // }
                console.log('this.widget.payload', this.widget.payload);
                el.setAttribute('auth-token', this.widget.payload['auth-token']);
                el.setAttribute('payload', JSON.stringify(this.widget.payload));
                console.log('el', el);
                this.renderer2.setStyle(el, 'width', '100%');
                this.renderer2.setStyle(el, 'height', '100%');
                this.renderer2.appendChild(this.banner.nativeElement, el);
            });
        }
    }
}
