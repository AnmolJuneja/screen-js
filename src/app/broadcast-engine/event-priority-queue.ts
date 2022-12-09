
import { RRule } from 'rrule';
import * as moment from 'moment-timezone';
import { NGXLogger } from 'ngx-logger';

import { IBroadcast } from 'app/models/broadcast.model';
import { IScheduledContent } from '../models/scheduled-content.model';
import { PriorityQueue } from './priority-queue';

import { Showtime, ShowtimeAction, ShowtimePriority, ShowtimeInterval } from './showtime';

/**
 * Maintains a priority queue of Showtimes generated from the ContentSchedulingRules in a Broadcast.
 */
export class EventPriorityQueue {
    /*private*/ broadcast: IBroadcast;
    /*private*/ rangeStart: moment.Moment;
    /*private*/ rangeEnd: moment.Moment;
    /*private*/ tz: string;
    /*private*/ showtimes: Showtime[] = [];

    /**
     * Create a queue containing all showtimes in specified time range for a specified timezone
     * @param broadcast JSON from Addulate REST API
     * @param rangeStart minimum datetime for generated showtimes
     * @param rangeEnd maximum datetime for generating showtimes
     * @param tz timezone using the IANA database e.g. ('America/New_York')
     */
    constructor(
        broadcast: IBroadcast,
        rangeStart: moment.Moment,
        rangeEnd: moment.Moment,
        tz: string,
        private logger: NGXLogger,
    ) {
        this.broadcast = broadcast;
        this.rangeStart = rangeStart;
        this.rangeEnd = rangeEnd;
        if (!broadcast || !rangeStart || !rangeEnd || rangeEnd.valueOf() <= rangeStart.valueOf()) {
            return;
        }
        this.tz = tz;
        this.showtimes = this.showtimes.concat(this.generateShowtimesInRange());
        this.showtimes = this.showtimes.concat(this.generateShowtimesForDefaultPlaylist());
        this.sortShowtimes();
    }

    public check(at: moment.Moment): { now: Showtime, next: Showtime } {
        const bundle: { queue: PriorityQueue<Showtime>, index: number } = this.eventQueueAtTime(at);
        const queue: PriorityQueue<Showtime> = bundle.queue;
        const now: Showtime = queue.peek().item;

        let next: Showtime;
        let i: number = bundle.index;
        const end: number = this.showtimes.length;
        for (; i < end; ++i) {
            const showtime: Showtime = this.showtimes[i];
            if (showtime.action === ShowtimeAction.start) {
                queue.enqueue(showtime, showtime.priority);
            } else { // its an end event, remove the matching start event.
                queue.remove(showtime.priority, match => {
                    return match.scheduledContent.id === showtime.scheduledContent.id;
                });
            }
            const highestPriorityShow: { item: Showtime, priority: number } = queue.peek();
            if (!highestPriorityShow) {
                break;
            } else if (highestPriorityShow.item.scheduledContent.id !== now.scheduledContent.id) {
                next = Object.assign({}, highestPriorityShow.item);
                next.at = showtime.at; // (in case next is a lower-priority showtime just revealed)
                break;
            }
        }
        return { now: now, next: next };
    }

    /*private*/ generateShowtimesForDefaultPlaylist() {
        const retval: Showtime[] = [];
        if (this.broadcast.channel.defaultPlaylistId) {

            // create a showtime based on the default playlist of the channel
            const showtime: Showtime = new Showtime();
            showtime.priority = ShowtimePriority.channel_default;
            showtime.at = this.rangeStart;
            showtime.action = ShowtimeAction.start;
            showtime.scheduledContent = <IScheduledContent>{
                id: 'scheduledContent_default',
                playlistId: this.broadcast.channel.defaultPlaylistId,
                playlist: this.broadcast.playlists.find(item => item.id === this.broadcast.channel.defaultPlaylistId)
            };

            // duration in this case is the entire length of time in seconds
            const durationSecs: number = (this.rangeEnd.valueOf() - this.rangeStart.valueOf()) / 1000;
            const interval: ShowtimeInterval = new ShowtimeInterval(showtime, durationSecs);
            interval.conditionalInsertInto(retval);
        }
        return retval;
    }

    /*private*/ generateShowtimesInRange() {
        const retval: Showtime[] = [];

        // NOTE: searching for recurring rules has to exte

        // load all the scheduledContent into retval (expanding all recurrances)
        this.broadcast.scheduledContent.forEach((scheduledContent: IScheduledContent) => {
            if (scheduledContent.recurranceRule) { // if it recurrs, get all applicable instances
                const rrule: RRule = RRule.fromString(scheduledContent.recurranceRule);

                // NOTE: the search has to extend back to when each event *could* start,
                //       so we use this.rangeStart-duration
                const duration: moment.Duration = moment.duration(scheduledContent.duration);
                const searchStart: moment.Moment = this.rangeStart.clone();
                searchStart.subtract(duration);
                const dates: Date[] = rrule.between(searchStart.toDate(), this.rangeEnd.toDate());
                dates.forEach((date: Date) => {
                    const interval: ShowtimeInterval = this.showtimeIntervalForSchedulingRuleAtTime(scheduledContent, moment(date).tz(this.tz));
                    interval.conditionalInsertInto(retval);
                });
            } else { // else get only the instances in range
                const interval: ShowtimeInterval = this.showtimeIntervalForSchedulingRuleInRange(scheduledContent, this.rangeStart, this.rangeEnd);
                interval.conditionalInsertInto(retval);
            }
        });
        return retval;
    }

    // Showtime starts and stops are sorted primarily by time (chronologically)
    // If two events happen at the same time, ending events come before beginning ones (practical, to keep overlap low)
    // If two events happen at the same time and are the same action, then higher priority events start first and end last.
    // note compare function returns -ne for a<b, +
    /*private*/ sortShowtimes(): void {
        this.showtimes.sort((a: Showtime, b: Showtime): number => {
            if (a.at.isBefore(b.at)) {
                return -1;
            } else if (a.at.isAfter(b.at)) {
                return 1;
            } else { // if time is same, sort by action (ends, before starts)
                if (a.action === ShowtimeAction.end && b.action === ShowtimeAction.start) {
                    return -1;
                } else if (a.action === ShowtimeAction.start && b.action === ShowtimeAction.end) {
                    return 1;
                } else { // if time is same and action is same...
                    const priorityDiff: number = b.priority - a.priority; // decreasing
                    return (a.action === ShowtimeAction.start) ? priorityDiff : -priorityDiff;
                }
            }
        });
    }

    /*private*/ showtimeIntervalForSchedulingRuleAtTime(
        scheduledContent: IScheduledContent,
        date: moment.Moment
    ): ShowtimeInterval {
        const start: Showtime = new Showtime();
        start.action = ShowtimeAction.start;
        start.at = date;
        start.priority = ShowtimePriority.customer_3;
        start.scheduledContent = scheduledContent;

        const duration: moment.Duration = moment.duration(scheduledContent.duration);
        const interval: ShowtimeInterval = new ShowtimeInterval(start, duration.asSeconds());
        return interval;
    }

    /*private*/ showtimeIntervalForSchedulingRuleInRange(
        scheduledContent: IScheduledContent,
        rangeStart: moment.Moment,
        rangeEnd: moment.Moment
    ): ShowtimeInterval {
        const itemStart: moment.Moment = moment.tz(scheduledContent.startDatetime, this.tz);
        const duration: moment.Duration = moment.duration(scheduledContent.duration);
        const itemEnd: moment.Moment = moment.tz(scheduledContent.startDatetime, this.tz).add(duration);
        if (itemStart.isAfter(rangeEnd) || itemEnd.isBefore(rangeStart)) {
            return new ShowtimeInterval(undefined, NaN);
        } else {
            const start: Showtime = new Showtime();
            start.action = ShowtimeAction.start;
            start.at = itemStart;
            start.priority = 3;
            start.scheduledContent = scheduledContent;

            return new ShowtimeInterval(start, duration.asSeconds());
        }
    }

    /*private*/ eventQueueAtTime(time: moment.Moment): { queue: PriorityQueue<Showtime>, index: number } {
        if (!time) {
            time = moment.tz(this.tz);
        }
        // 1. create an empty queue
        const q: PriorityQueue<Showtime> = new PriorityQueue<Showtime>(this.logger);

        // 2. find the index of the last event to evaluate
        const nextItemIndex = this.showtimes.findIndex(item => item.at.isAfter(time));
        if (nextItemIndex === -1) {
            return { queue: null, index: -1 };
        }

        // 3. slice the array for all preceding events and add or remove from queue as necessary.
        this.showtimes.slice(0, nextItemIndex).forEach((item: Showtime, index: number) => {
            if (item.action === ShowtimeAction.start) {
                q.enqueue(item, item.priority);
            } else {
                q.remove(item.priority, match => match.scheduledContent.id === item.scheduledContent.id);
            }
        });

        // 4. return queue and index to next item in this.showtimes[]
        this.logger.log('eventQueueAtTime() ' + time.format() + '):\n' + this.summary(q));
        return { queue: q, index: nextItemIndex };
    }

    /*private*/ nextEvents(onOrAfter: moment): Showtime[] {
        const beginIndex = this.showtimes.findIndex(item => item.at.isAfter(onOrAfter));
        if (beginIndex === -1) {
            return [];
        }
        const beginDateTime = this.showtimes[beginIndex].at;
        const endIndex = this.showtimes.findIndex(item => item.at.isAfter(beginDateTime));
        return this.showtimes.slice(beginIndex, endIndex);
    }

    summary(queue: PriorityQueue<Showtime>): string {
        const retval: string[] = [];
        queue.forEachBucket((bucket: number, showtimes: Showtime[]) => {
            const bits: string[] = [];
            showtimes.forEach(value => {
                bits.push('[' + value.at.format() + ': ' + (value.action ? 'start' : 'stop') + ' ' + value.scheduledContent.playlist.title + '] ');
            });
            const line = '' + bucket + ': ' + bits.join(' ');
            retval.push(line);
        });
        return retval.join('\n');
    }
}
