import { Component, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, HostBinding } from '@angular/core';
import { VideoMediaComponent } from '../video-media/video-media.component';
import { ContentViewerComponent } from '../content-viewer/content-viewer.component';
import { IPlaylistItem } from '../models/playlistitem.model';
import { IVideo } from '../models/video.model';
import { NGXLogger } from 'ngx-logger';
import { DemoMediaComponent } from '../demo-media/demo-media.component';
import { Observable, timer } from 'rxjs';
import { ComputerVisionService } from '../services/computer-vision.service';

const defaultPlaylistItem: IPlaylistItem = <IPlaylistItem>{
    id: 'demo',
    position: 0,
    itemType: 'video',
    itemId: '',
    item: <IVideo>{
        id: 'video_4f160ea6-3b2f-4cc3-a2fd-b4f2f47fd756',
        title: 'title',
        description: 'demo reel',
        thumbnailUrl: 'https://media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/video_4f160ea6-3b2f-4cc3-a2fd-b4f2f47fd756_thumb.png',
        contentUrl: 'https://media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/video_4f160ea6-3b2f-4cc3-a2fd-b4f2f47fd756.mp4',
        mimeType: 'video/mp4',
        width: 1024,
        height: 576,
        fileSizeBytes: 7596280,
        durationSecs: 55.101,
        createdAt: '2019-01-07T20:21:35.000Z',
        updatedAt: '2019-01-07T20:21:35.000Z',
        accountId: 'account_00000000-0000-4000-b000-000000000000',
        creatorId: 'user_00000000-0000-4000-b000-000000000000'
    },
    startTime: 0,
    durationSecs: 0,
    createdAt: '',
    updatedAt: '',
    playlistId: undefined,
};

@Component({
    selector: 'app-demo-viewer',
    templateUrl: './demo-viewer.component.html',
    styleUrls: ['./demo-viewer.component.css']
})
export class DemoViewerComponent extends ContentViewerComponent implements AfterViewInit {

    @ViewChild(VideoMediaComponent, { static: false })
    video: VideoMediaComponent;

    @ViewChild(DemoMediaComponent, { static: false })
    demo: DemoMediaComponent;

    @HostBinding('hidden')
    isHidden: boolean = false;

    @Input()
    screenId: string;

    @Input()
    dateTime: string;

    @Input()
    imageUrl: string;

    @Input()
    showDataSecs: number = 30;

    @Output()
    dataReady: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    demoComplete: EventEmitter<boolean> = new EventEmitter<boolean>();

    data: any;

    autoplay: boolean = true;

    @Input() willPlayVideo: boolean = true;
    waitingOnData: boolean = true;
    willShowData: boolean = false;
    showingData: boolean = false;
    stealthMode: boolean = false;

    playlistItem: IPlaylistItem = defaultPlaylistItem;

    constructor(
        private logger: NGXLogger,
        private cvService: ComputerVisionService,
    ) {
        super();
    }

    ngAfterViewInit(): void {
        if (this.willPlayVideo) {
            // NOTE: microtask avoids ExpressionChangedAfterItHasBeenCheckedError
            this.logger.debug('DemoViewer: ngAfterViewInit() -- willPlayVideo');
            Promise.resolve(null).then(() => this.video.show());
            this.video.play();
        } else if (this.waitingOnData) {
            // we are only popping up after the data is ready
            this.logger.debug('DemoViewer: ngAfterViewInit() -- waitingOnData');
            this.stealthMode = true;
            this.isHidden = true;
        } else {
            // this case doesn't make sense
            this.logger.error('DemoViewer: ngAfterViewInit() -- unexpected state');
            return;
        }
        this.cvService.getCount(this.screenId, this.dateTime)
            .subscribe(
                (next: any) => {
                    this.logger.info('DemoViewer: got CV data');
                    this.data = next;
                    this.waitingOnData = false;
                    this.willShowData = true;
                },
                (err: any) => {
                    this.logger.error('DemoViewer: ComputerVision demo failed: ', err);
                    this.waitingOnData = false;
                    this.willShowData = false;
                    this.dataReady.emit(this.willShowData);
                },
                () => {
                    this.logger.info('DemoViewer: CV data complete');
                    this.dataReady.emit(this.willShowData);
                    if (this.stealthMode) {
                        this.showData();
                    }
                }
            );
    }

    onPlayEnded(): void {
        if (this.waitingOnData) {
            this.logger.info('DemoViewer: Demo ended. No data to show.');
            this.demoComplete.emit(false);
        } else {
            this.logger.info('DemoViewer: Demo ended. Showing data...');
            this.showData();
        }
        this.willPlayVideo = false;
    }

    showData(): void {
        this.logger.info('DemoViewer: showData().');
        this.showingData = true;
        this.isHidden = false;
        const tmr: Observable<number> = timer(this.showDataSecs * 1000);
        tmr.subscribe((t: number) => {
            this.logger.info('DemoViewer: showData()==>demoComplete');
            this.demoComplete.emit(true);
        });
    }
}
