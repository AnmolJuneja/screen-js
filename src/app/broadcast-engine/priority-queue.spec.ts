import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { NGXLogger } from 'ngx-logger';
import { NGXLoggerMock } from 'ngx-logger/testing';
import { PriorityQueue } from './priority-queue';


describe('Priority Queue', () => {

    let logger: NGXLogger;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                LoggerTestingModule
            ],
            providers: [
                { provide: NGXLogger, useClass: NGXLoggerMock },
            ],
        });
        logger = TestBed.get(NGXLogger);
    });


    it('can be instantiated', () => {
        // assume
        // when
        const q = new PriorityQueue<string>(logger);

        // assert
        expect(q).toBeTruthy();
        expect(q.size).toBe(0);
        expect(q.nbuckets).toBe(0);
    });

    it('can insert items', () => {
        // assume
        const q = new PriorityQueue<string>(logger);

        // when
        q.enqueue('hello', 1);

        // assert
        expect(q.size).toBe(1);
        expect(q.nbuckets).toBe(1);
        expect(q.peek()).toEqual({ item: 'hello', priority: 1 });
    });

    it('can remove items', () => {
        // assume
        const q = new PriorityQueue<string>(logger);
        q.enqueue('hello', 1);
        // when
        q.dequeue();
        // then
        expect(q).toBeTruthy();
        expect(q.size).toBe(0);
        expect(q.nbuckets).toBe(0);
    });

    it('will show higher priority items first', () => {
        // assume
        const q = new PriorityQueue<string>(logger);
        q.enqueue('hello', 1);
        // when
        q.enqueue('there', 2);
        // then
        expect(q.size).toBe(2);
        expect(q.nbuckets).toBe(2);
        expect(q.peek()).toEqual({ item: 'there', priority: 2 });
    });


    it('will be FIFO among items in max priority', () => {
        // assume
        const q = new PriorityQueue<string>(logger);
        q.enqueue('hello', 1);
        // when
        q.enqueue('there', 1);
        // then
        expect(q.size).toBe(2);
        expect(q.nbuckets).toBe(1);
        expect(q.peek()).toEqual({ item: 'hello', priority: 1 });
    });

    it('allows things to be removed from inside', () => {
        // assume
        const q = new PriorityQueue<string>(logger);
        q.enqueue('hello', 1);
        q.enqueue('there', 2);
        // when
        q.remove(1, (str) => str === 'hello');
        // then
        expect(q.size).toBe(1);
        expect(q.nbuckets).toBe(1);
        expect(q.peek()).toEqual({ item: 'there', priority: 2 });
    });

    it('passes a stress-test', () => {
        // assume
        const q = new PriorityQueue<string>(logger);
        ['this', 'array', 'will', 'be', 'used', 'as', 'a', 'test',
            'where', 'the', 'priority', 'equals', 'string', 'length'].forEach(word => {
                q.enqueue(word, word.length);
            });
        ['will', 'as', 'where', 'equals'].forEach(word => {
            q.remove(word.length, item => item === word);
        });
        expect(q.size).toBe(10);
        expect(q.nbuckets).toBe(7);
        expect(q.dequeue()).toEqual({ item: 'priority', priority: 8 });
        expect(q.size).toBe(9);
        expect(q.nbuckets).toBe(6);
        expect(q.dequeue()).toEqual({ item: 'string', priority: 6 });
        expect(q.size).toBe(8);
        expect(q.nbuckets).toBe(6);
        expect(q.dequeue()).toEqual({ item: 'length', priority: 6 });
        expect(q.size).toBe(7);
        expect(q.nbuckets).toBe(5);
        expect(q.dequeue()).toEqual({ item: 'array', priority: 5 });
        expect(q.size).toBe(6);
        expect(q.nbuckets).toBe(4);
        expect(q.dequeue()).toEqual({ item: 'this', priority: 4 });
        expect(q.size).toBe(5);
        expect(q.nbuckets).toBe(4);
        expect(q.dequeue()).toEqual({ item: 'used', priority: 4 });
        expect(q.size).toBe(4);
        expect(q.nbuckets).toBe(4);
        expect(q.dequeue()).toEqual({ item: 'test', priority: 4 });
        expect(q.size).toBe(3);
        expect(q.nbuckets).toBe(3);
        expect(q.dequeue()).toEqual({ item: 'the', priority: 3 });
        expect(q.size).toBe(2);
        expect(q.nbuckets).toBe(2);
        expect(q.dequeue()).toEqual({ item: 'be', priority: 2 });
        expect(q.size).toBe(1);
        expect(q.nbuckets).toBe(1);
        expect(q.dequeue()).toEqual({ item: 'a', priority: 1 });
        expect(q.size).toBe(0);
        expect(q.nbuckets).toBe(0);
        expect(q.dequeue()).toBeFalsy();
    });

});
