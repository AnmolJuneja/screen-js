import { Component } from '@angular/core';
import { NGXLogger, NGXLoggerMonitor, NGXLogInterface } from 'ngx-logger';

export class MyLoggerMonitor implements NGXLoggerMonitor {
    onLog(log: NGXLogInterface) {
        console.log(JSON.stringify(log));
    }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private logger: NGXLogger) {
        this.logger.registerMonitor(new MyLoggerMonitor());
    }

}
