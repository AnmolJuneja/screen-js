import { Component, Output, EventEmitter } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
    selector: 'app-content-media',
    templateUrl: './content-media.component.html',
    styleUrls: ['./content-media.component.css'],
    // children need this animations bit because it can't be inherited.
    animations: [
        trigger('fade', [
            state('void', style({ opacity: 0 })),
            state('hidden', style({ opacity: 0 })),
            state('showing', style({ opacity: 1 })),
            transition('hidden <=> showing', [
                animate(1000)
            ]),
            transition('void <=> showing', [
                animate(1000)
            ]),
        ])
    ],
})
export class ContentMediaComponent {
    // total elapsed time that media is showing
    private _elapsedMSecs: number = -1;

    // intrinsic duration of the content before repeating
    // -1 ==> unknown
    protected durationMSecs: number = -1;

    // number of repeats === floor( elapsedTime / durationMSecs ) iff durationMSecs > 0)
    //                   === 0 iff durationMSecs <= 0
    protected lapCounter: number = 0;

    // playhead time after repeats  === elapsedTime % durationMSecs iff durationMSecs > 0
    //                              === elapsedTime iff durationMSecs <= 0
    protected mSecsThisLap: number = -1;

    // shows the percentage loaded
    @Output()
    loaded = new EventEmitter();

    // alert that the content failed to load
    @Output()
    loadError = new EventEmitter();

    // alert that the content transitioned to playing
    @Output()
    playing = new EventEmitter();

    // alert that the content transitioned to paused
    @Output()
    paused = new EventEmitter();

    // alert that the content completed playing
    @Output()
    ended = new EventEmitter();

    visualState: string = 'hidden';

    constructor() { }

    complete(): void {
        // override for analytics of a media completion
    }

    reset(): void {
        // reset any internal state after hidden
    }

    hide(): void {
        this.visualState = 'hidden';
    }

    show(): void {
        this.visualState = 'showing';
    }

    async load(): Promise<boolean> {
        return false;
    }

    async play(): Promise<boolean> {
        return false;
    }

    pause(): void {
    }

    get elapsedMSecs(): number {
        return this._elapsedMSecs;
    }

    // can be a seek for video if beyond some tolerance.
    setElapsedMSecs(elapsedMSecs: number) {
        if (elapsedMSecs < 0) {
            throw new RangeError('cannot set negative time');
        }
        this._elapsedMSecs = elapsedMSecs;
        if (this.durationMSecs > 0) {
            this.lapCounter = Math.floor(this._elapsedMSecs / this.durationMSecs);
            this.mSecsThisLap = this._elapsedMSecs % this.durationMSecs;
        } else {
            this.lapCounter = 0;
            this.mSecsThisLap = this._elapsedMSecs;
        }
    }

}
