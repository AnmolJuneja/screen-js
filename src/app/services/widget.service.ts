import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WidgetService {

    static loadedWidgetsLinks: { [key: string]: boolean } = {};

    constructor() { }

    loadWidgetScript(source: string) {
        if (WidgetService.loadedWidgetsLinks[source] !== undefined) {
            return of(true);
        }
        return new Observable((subs) => {
            WidgetService.loadedWidgetsLinks[source] = false;
            const scriptElement = document.createElement('script');
            scriptElement.src = source;
            document.head.append(scriptElement);
            console.log('scriptElement', scriptElement);
            scriptElement.onload = () => {
                WidgetService.loadedWidgetsLinks[source] = true;
                subs.next(true);
                subs.complete();
            };
            scriptElement.onerror = (err) => {
                WidgetService.loadedWidgetsLinks[source] = true;
                subs.error(err);
                subs.complete();
            };
        });
    }

    loadWidgetStyles(source: string) {
        if (WidgetService.loadedWidgetsLinks[source] !== undefined) {
            return of(true);
        }
        return new Observable((subs) => {
            WidgetService.loadedWidgetsLinks[source] = false;
            const linkElement = document.createElement('link');
            linkElement.href = source;
            linkElement.rel = 'stylesheet';
            document.head.append(linkElement);
            console.log('scriptElement', linkElement);
            linkElement.onload = () => {
                WidgetService.loadedWidgetsLinks[source] = true;
                subs.next(true);
                subs.complete();
            };
            linkElement.onerror = (err) => {
                WidgetService.loadedWidgetsLinks[source] = true;
                subs.error(err);
                subs.complete();
            };
        });
    }
}
