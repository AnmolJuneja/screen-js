
import { IScheduledContent } from '../models/scheduled-content.model';
import * as moment from 'moment-timezone';

export const enum ShowtimeAction {
    end = 0,
    start = 1,
}

export const enum ShowtimePriority {
    region_default = -2,
    customer_default = -1,
    channel_default = 0,
    customer_1 = 1,
    customer_2 = 2,
    customer_3 = 3,
    customer_4 = 4,
    customer_5 = 5,
    paid_ad = 6,
    local_alert = 7,
    disaster_alert = 8,
    system_diagnostic = 9
}

export class Showtime {
    at: moment.Moment;
    action: ShowtimeAction;
    scheduledContent: IScheduledContent;
    priority: ShowtimePriority;
}

export class ShowtimeInterval {
    start: Showtime;
    end: Showtime;
    constructor(start: Showtime, durationSecs: number) {
        if (!start || isNaN(durationSecs)) {
            this.start = undefined;
            this.end = undefined;
        } else {
            this.start = start;
            this.start.action = ShowtimeAction.start;
            this.end = new Showtime();
            this.end.action = ShowtimeAction.end;
            this.end.scheduledContent = this.start.scheduledContent;
            this.end.priority = this.start.priority;
            this.end.at = this.start.at.clone();
            this.end.at.add(durationSecs, 'seconds');
        }
    }

    conditionalInsertInto(array: Showtime[]) {
        if (!!this.start && !!this.end) {
            array.push(this.start);
            array.push(this.end);
        }
    }
}
