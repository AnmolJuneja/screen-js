
import { ReplaySubject } from 'rxjs';

import { NGXLogger } from 'ngx-logger';

import * as moment from 'moment-timezone';

import { IBroadcast } from '../models/broadcast.model';
import { Showtime } from './showtime';
import { EventPriorityQueue } from './event-priority-queue';
import { AndroidPlatformService } from 'app/services/android-platform.service';
import { IScreen } from 'app/models/screen.model';


/** Helper classes broken out separately for clarity */
export class TimeUtils {

    /**
     * returns true iff  startSeconds <= now <= (startSeconds+duration)
     * but does a bunch of normalization first, and accounts for wraparound after midnight.
     *
     * @param now - the time to consider
     * @param startSeconds - time of day in seconds range=[00:00:00, 23:59:59]
     * @param durationSeconds - duration in seconds range=[00:00:00, 23:59:59]
     */
    public isNowBetweenStartAndEnd(
        now: moment.Moment,
        startSeconds: number,
        durationSeconds: number
    ): boolean {
        const secondsPerDay: number = 24 * 60 * 60;  // 24 hours * 60 minutes * 60 seconds
        const endSeconds: number = startSeconds + durationSeconds;
        const startOfToday: moment.Moment = now.clone().startOf('day');
        const nowSeconds: number = now.diff(startOfToday, 'seconds');
        const extendsPastMidnight: boolean = endSeconds > secondsPerDay;
        if (extendsPastMidnight) {
            const wrappedEndSeconds = endSeconds % secondsPerDay;
            return nowSeconds < wrappedEndSeconds || startSeconds < nowSeconds;
        } else {
            return startSeconds < nowSeconds && nowSeconds < endSeconds;
        }
    }
}

/**
 * Utility object that associated a counter with a show
 */
export interface CountedShowtime {
    show: Showtime;
    counter: number;
}

/**
 * The main engine for managing broadcasts.
 *
 * It mainly works by recieving clock ticks, and then advancing the playlist
 * and/or triggering an audience count.
 */
export class BroadcastEngine {
    private broadcast: IBroadcast;
    private queue: EventPriorityQueue;
    private tz: string;
    private counter: number = 0;
    private nextCheckAudience: moment.Moment;

    showingNow: Showtime;
    showingNext: Showtime;

    private timeUtils = new TimeUtils();

    // a stream of playlists timed for when they should play
    public preloadShow: ReplaySubject<CountedShowtime> = new ReplaySubject<CountedShowtime>(1);
    public showShow: ReplaySubject<CountedShowtime> = new ReplaySubject<CountedShowtime>(1);

    constructor(
        private android: AndroidPlatformService,
        private logger: NGXLogger,
    ) {
    }

    public runBroadcast(broadcast: IBroadcast) {
        if (!broadcast) {
            // TODO: how to handle this error?
            this.logger.error('BroadcastEngine.runBroadcast() needs a valid (non-null) argument');
            return;
        } else if (broadcast.playlists.length === 0) {
            this.logger.error('BroadcastEngine.runBroadcast() needs valid playlists to run');
            return;
        }

        // this.logger.log('BroadcastEngine.runBroadcast() -- time to reset everything');
        this.broadcast = broadcast;
        this.tz = broadcast.screen.timezone;

        // reset timers
        this.nextCheckAudience = new moment.tz(this.tz);
        const rangeStart: moment.moment = new moment.tz(this.tz);
        const rangeEnd: moment.moment = new moment(rangeStart).add(1, 'day');

        // initialize new queue
        this.queue = new EventPriorityQueue(this.broadcast, rangeStart, rangeEnd, this.tz, this.logger);
        this.check(rangeStart);

        // load up the shows
        this.preloadShow.next({ show: this.showingNow, counter: ++this.counter });
        this.showShow.next({ show: this.showingNow, counter: this.counter });
        if (!!this.showingNext) {
            this.preloadShow.next({ show: this.showingNext, counter: ++this.counter });
        }
    }

    /**
     * Clock tick - called periodically to update everything.
     * @param now
     */
    tick(now: moment.Moment) {
        this.checkForPlaylistChangeOnTick(now);
        if (!this.broadcast) {
            return;
        }
        this.checkForAudienceCountOnTick(now);
    }

    private checkForPlaylistChangeOnTick(now: moment) {
        if (!!this.showingNext && now.isAfter(this.showingNext.at)) {
            this.logger.log('BroadcastEngine.tick(', now.format(), ') -- time to change playlists');
            this.check(now);
            this.showShow.next({ show: this.showingNow, counter: this.counter });
            if (!!this.showingNext) {
                this.preloadShow.next({ show: this.showingNext, counter: ++this.counter });
            }
        }
    }

    private checkForAudienceCountOnTick(now: moment) {
        // if we count audience periodically
        const screen: IScreen = this.broadcast.screen;
        if (!!screen.countAudiencePeriod && screen.countAudiencePeriod > 0) {
            // if time since last photo > screen.countAudiencePeriod
            if (now.isAfter(this.nextCheckAudience)) {
                if (this.isNowBetweenStartAndEnd(now)) {
                    this.logger.info('snapPhoto');
                    this.android.snapPhoto(now.clone().utc().format());
                    this.nextCheckAudience = now.clone().add(screen.countAudiencePeriod, 'seconds');
                } else {
                    this.nextCheckAudience = now.clone().startOf('day').add(screen.countAudienceStart, 'seconds');
                }
            }
        }
    }

    /**
     * This seemingly simple calculation is complicated by wraparound over midnight
     *
     *
     * @param now
     */
    private isNowBetweenStartAndEnd(now: moment.Moment) {
        const startSeconds = this.broadcast.screen.countAudienceStart;
        const durationSeconds = this.broadcast.screen.countAudienceDuration;
        return this.timeUtils.isNowBetweenStartAndEnd(now, startSeconds, durationSeconds);
    }


    private check(at: moment.Moment): void {
        const temp = this.queue.check(at);
        this.showingNow = temp.now;
        this.showingNext = temp.next;
    }

}



