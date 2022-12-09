import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { NGXLogger } from 'ngx-logger';
import { NGXLoggerMock } from 'ngx-logger/testing';
import { BroadcastEngine, TimeUtils } from './broadcast-engine';

import { AndroidPlatformService } from 'app/services/android-platform.service';

import * as moment from 'moment-timezone';


describe('EventPriorityQueue', () => {

    let engine: BroadcastEngine;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                LoggerTestingModule
            ],
            providers: [
                AndroidPlatformService,
                { provide: NGXLogger, useClass: NGXLoggerMock },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const service = TestBed.get(AndroidPlatformService);
        const logger = TestBed.get(NGXLogger);
        engine = new BroadcastEngine(service, logger);
    });

    it('can be instantiated', () => {
        expect(engine).toBeTruthy();
    });

});

describe('TimeUtils', () => {

    const utils = new TimeUtils();

    describe('simple cases in range', () => {

        it('should say 01:30:00 is between 01:00:00 and 03:00:00', () => {
            // given
            const startSeconds = 1 * 60 * 60; // 1:00:00 start
            const durationSeconds = 2 * 60 * 60; // 2:00:00 duration
            const now = moment('2019-06-05T01:30:00');

            // when
            const result = utils.isNowBetweenStartAndEnd(now, startSeconds, durationSeconds);

            // then
            expect(result).toBeTruthy();
        });

        it('should say 14:59:59 is between 12:00:00 and 15:00:00', () => {
            // given
            const startSeconds = 12 * 60 * 60; // 12:00:00 start
            const durationSeconds = 5 * 60 * 60; // 5:00:00 duration
            const now = moment('2019-06-05T14:59:59');

            // when
            const result = utils.isNowBetweenStartAndEnd(now, startSeconds, durationSeconds);

            // then
            expect(result).toBeTruthy();
        });

    });

    describe('simple cases out of range', () => {

        it('should reject 0:30 for being outside 1:00-3:00', () => {
            // given
            const startSeconds = 1 * 60 * 60; // 1:00:00 start
            const durationSeconds = 2 * 60 * 60; // 2:00:00 duration
            const now = moment('2019-06-05T00:30:00');

            // when
            const result = utils.isNowBetweenStartAndEnd(now, startSeconds, durationSeconds);

            // then
            expect(result).toBeFalsy();
        });

        it('should reject 5:30 for being outside 1:00-3:00', () => {
            // given
            const startSeconds = 1 * 60 * 60; // 1:00:00 start
            const durationSeconds = 2 * 60 * 60; // 2:00:00 duration
            const now = moment('2019-06-05T05:30:00');

            // when
            const result = utils.isNowBetweenStartAndEnd(now, startSeconds, durationSeconds);

            // then
            expect(result).toBeFalsy();
        });

    });

    describe('wraparound cases in range', () => {

        it('should allow 1:30 between 21:00:00->2:00:00', () => {
            // given
            const startSeconds = 21 * 60 * 60; // 1:00:00 start
            const durationSeconds = 5 * 60 * 60; // 2:00:00 duration
            const now = moment('2019-06-05T01:30:00');

            // when
            const result = utils.isNowBetweenStartAndEnd(now, startSeconds, durationSeconds);

            // then
            expect(result).toBeTruthy();
        });

        it('should allow 21:30 between 21:00:00->2:00:00', () => {
            // given
            const startSeconds = 21 * 60 * 60; // 1:00:00 start
            const durationSeconds = 5 * 60 * 60; // 2:00:00 duration
            const now = moment('2019-06-05T21:30:00');

            // when
            const result = utils.isNowBetweenStartAndEnd(now, startSeconds, durationSeconds);

            // then
            expect(result).toBeTruthy();
        });

    });

    describe('wraparound cases out range', () => {

        it('should refuse 2:01 between 21:00:00->2:00:00', () => {
            // given
            const startSeconds = 21 * 60 * 60; // 1:00:00 start
            const durationSeconds = 5 * 60 * 60; // 2:00:00 duration
            const now = moment('2019-06-05T02:01:00');

            // when
            const result = utils.isNowBetweenStartAndEnd(now, startSeconds, durationSeconds);

            // then
            expect(result).toBeFalsy();
        });

        it('should refuse 20:59:59 between 21:00:00->2:00:00', () => {
            // given
            const startSeconds = 21 * 60 * 60; // 1:00:00 start
            const durationSeconds = 5 * 60 * 60; // 2:00:00 duration
            const now = moment('2019-06-05T20:59:59');

            // when
            const result = utils.isNowBetweenStartAndEnd(now, startSeconds, durationSeconds);

            // then
            expect(result).toBeFalsy();
        });

    });

});
