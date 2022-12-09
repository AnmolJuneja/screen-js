import { RRule } from 'rrule';
import * as moment from 'moment-timezone';

import { TimeUtils } from './broadcast-engine';

describe('date/time manipulations', () => {
    it('should generate dates with recurrence rules', () => {
        // given
        const events: Date[] = [];
        const startDate: Date = moment('2017-12-01T00:00:00Z').toDate();
        const endDate: Date = moment('2017-12-02T00:00:00Z').toDate();

        // when
        const rrule: RRule = RRule.fromString('DTSTART=20171129T110000Z;FREQ=DAILY;INTERVAL=1');
        rrule.between(startDate, endDate).forEach((date: Date) => {
            events.push(date);
        });

        // assert
        expect(events).toContain(moment('2017-12-01T11:00:00Z').toDate());
    });

    it('should apply a local timezone to a zoneless datetime string without time conversion', () => {
        const la = moment.tz('2017-12-01T12:00:00', 'America/Los_Angeles').format();
        const nyc = moment.tz('2017-12-01T12:00:00', 'America/New_York').format();

        expect(la).toBe('2017-12-01T12:00:00-08:00');
        expect(nyc).toBe('2017-12-01T12:00:00-05:00');
    });


    it('should apply a local timezone to a UTC datetime string with time conversion', () => {
        const la = moment.tz('2017-12-01T12:00:00Z', 'America/Los_Angeles').format();
        const nyc = moment.tz('2017-12-01T12:00:00Z', 'America/New_York').format();

        expect(la).toBe('2017-12-01T04:00:00-08:00');
        expect(nyc).toBe('2017-12-01T07:00:00-05:00');
    });

    it('will apply a local timezone automatically, then apply tz conversion with timeshift', () => {
        const la = moment('2017-12-01T12:00:00').tz('America/Los_Angeles').format();
        const nyc = moment('2017-12-01T12:00:00').tz('America/New_York').format();

        expect(la).toBe('2017-12-01T12:00:00-08:00');
        expect(nyc).toBe('2017-12-01T15:00:00-05:00');
    });
});

