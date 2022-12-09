import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import noframe from 'reframe.js';
import reframe from 'reframe.js';

import { IYoutube } from '../models/youtube.model';
import { NGXLogger } from 'ngx-logger';


@Component({
    selector: 'app-youtube-viewer',
    templateUrl: './youtube-viewer.component.html',
    styleUrls: ['./youtube-viewer.component.css']
})
export class YoutubeViewerComponent implements OnInit {
    private _youtube: IYoutube;
    private videoID: string;
    private reframed: boolean = false;

    public YT: any;

    public player: any;

    @Input()
    width: number = 1280;

    @Input()
    height: number = 720;

    @Input()
    verbose: boolean;

    @Input()
    src: string = '//www.youtube.com/embed/Od6hY_50Dh0?autoplay=1';

    @Input()
    set youtube(youtube: IYoutube) {
        if (!!youtube) {
            this._youtube = youtube;
            this.videoID = youtube.videoID;
            if (!!this.player) {
                this.logger.log('foo');
            }
        } else {
            this._youtube = undefined;
        }
    }
    get youtube(): IYoutube {
        return this._youtube;
    }

    constructor(
        private sanitizer: DomSanitizer,
        private logger: NGXLogger,
    ) { }

    ngOnInit() {
        this.loadJavaScript();

        this.videoID = '1cH2cerUpMQ'; // video id
        window['onYouTubeIframeAPIReady'] = (e) => {
            this.YT = window['YT'];
            this.reframed = false;
            this.player = new window['YT'].Player('player', {
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    loop: 1,
                    showinfo: 0,
                    disablekb: 1,
                    version: 3,
                    vq: 'large',
                    wmode: 'opaque',
                    rel: 0,
                    enablejsapi: 1,
                    origin: document.domain
                },
                videoId: this.videoID,
                height: window.innerHeight,
                width: window.innerWidth,
                events: {
                    onReady: (ev) => this.onPlayerReady(ev),
                    onError: (ev) => this.onPlayerError(ev),
                    onStateChange: (ev) => this.onPlayerStateChange(ev),
                }
            });
        };
    }

    onPlayerStateChange(event) {
        this.logger.log(event);
        switch (event.data) {
            case window['YT'].PlayerState.PLAYING:
                if (this.cleanTime() === 0) {
                    this.logger.log('started ' + this.cleanTime());
                } else {
                    this.logger.log('playing ' + this.cleanTime());
                }
                break;
            case window['YT'].PlayerState.PAUSED:
                if (this.player.getDuration() - this.player.getCurrentTime() !== 0) {
                    this.logger.log('paused' + ' @ ' + this.cleanTime());
                }
                break;
            case window['YT'].PlayerState.ENDED:
                this.logger.log('ended ');
                // event.target.playVideo();
                break;
        }
    }

    onResize(event) {
        this.logger.log(event);
        this.player.height = event.target.innerHeight;
        this.player.width = event.target.innerWidth;
    }

    // utility
    cleanTime() {
        return Math.round(this.player.getCurrentTime());
    }

    onPlayerReady(event) {
        if (!this.reframed) {
            this.reframed = true;
            // noframe(event.target.a);
            // reframe(event.target.a);
        }
    }

    onPlayerError(event) {
        switch (event.data) {
            case 2:
                this.logger.log('' + this.videoID);
                break;
            case 100:
                break;
            case 101 || 150:
                break;
        }
    }

    private loadJavaScript() {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

}


function onPlayerReadyJS(ev) {
    // this.onPlayerReady(ev);
}

function onPlayerErrorJS(ev) {
    // this.onPlayerError(ev);
}

function onPlayerStateChangeJS(ev) {
    // this.onPlayerStateChange(ev);
}
