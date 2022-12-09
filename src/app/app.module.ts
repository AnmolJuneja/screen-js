import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule, MatIconModule } from '@angular/material';

import { TranslateModule } from '@ngx-translate/core';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { VgCoreModule } from 'videogular2/compiled/core'; // 'videogular2/core';
import { VgControlsModule } from 'videogular2/compiled/controls';
import { VgOverlayPlayModule } from 'videogular2/compiled/overlay-play';
import { VgBufferingModule } from 'videogular2/compiled/buffering';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
// import { BroadcastComponent } from './broadcast/broadcast.component';

import { BroadcastService } from './services/broadcast.service';
import { AnalyticsService } from './services/analytics.service';
import { MixpanelService } from './services/mixpanel.service';
import { ImageService } from './services/image.service';
import { VideoService } from './services/video.service';
import { PlaylistService } from './services/playlist.service';
import { UrlService } from './services/url.service';
import { YoutubeService } from './services/youtube.service';
import { SplashComponent } from './splash/splash.component';
import { BroadcastViewerComponent } from './broadcast-viewer/broadcast-viewer.component';
import { VideoViewerComponent } from './video-viewer/video-viewer.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { PlaylistInsertDirective } from './playlist-insert.directive';
import { BroadcastInsertDirective } from './broadcast-insert.directive';
import { ImageLoaderComponent } from './image-loader/image-loader.component';
import { VideoLoaderComponent } from './video-loader/video-loader.component';
import { PlaylistLoaderComponent } from './playlist-loader/playlist-loader.component';
import { BroadcastLoaderComponent } from './broadcast-loader/broadcast-loader.component';
import { ContentLoaderComponent } from './content-loader/content-loader.component';
import { ImageMediaComponent } from './image-media/image-media.component';
import { PlaylistViewerComponent } from './playlist-viewer/playlist-viewer.component';
import { PlaylistMediaComponent } from './playlist-media/playlist-media.component';
import { VideoMediaComponent } from './video-media/video-media.component';
import { ElapsedTimePipe } from './elapsed-time.pipe';
import { ContentMediaComponent } from './content-media/content-media.component';
import { ContentViewerComponent } from './content-viewer/content-viewer.component';
import { YoutubeLoaderComponent } from './youtube-loader/youtube-loader.component';
import { YoutubeViewerComponent } from './youtube-viewer/youtube-viewer.component';
import { SafePipe } from './safe.pipe';
import { GlobalErrorHandler } from './global-error-handler/global-error-handler';
import { DemoLoaderComponent } from './demo-loader/demo-loader.component';
import { DemoViewerComponent } from './demo-viewer/demo-viewer.component';
import { DemoMediaComponent } from './demo-media/demo-media.component';
import { DemoMetadataComponent } from './demo-metadata/demo-metadata.component';
import { UrlLoaderComponent } from './url-loader/url-loader.component';
import { UrlViewerComponent } from './url-viewer/url-viewer.component';
import { UrlMediaComponent } from './url-media/url-media.component';
import { WidgetMediaComponent } from './widget-media/widget-media.component';


@NgModule({
    declarations: [
        AppComponent,
        SplashComponent,
        BroadcastViewerComponent,
        PlaylistViewerComponent,
        VideoViewerComponent,
        ImageViewerComponent,
        PlaylistInsertDirective,
        BroadcastInsertDirective,
        ImageLoaderComponent,
        VideoLoaderComponent,
        PlaylistLoaderComponent,
        BroadcastLoaderComponent,
        ContentLoaderComponent,
        PlaylistMediaComponent,
        ImageMediaComponent,
        PlaylistViewerComponent,
        VideoMediaComponent,
        ElapsedTimePipe,
        ContentMediaComponent,
        ContentViewerComponent,
        YoutubeLoaderComponent,
        YoutubeViewerComponent,
        SafePipe,
        DemoLoaderComponent,
        DemoViewerComponent,
        DemoMediaComponent,
        DemoMetadataComponent,
        UrlLoaderComponent,
        UrlViewerComponent,
        UrlMediaComponent,
        WidgetMediaComponent,
    ],
    imports: [
        LoggerModule.forRoot({
            serverLoggingUrl: '/api/logs',
            level: NgxLoggerLevel.DEBUG,
            serverLogLevel: NgxLoggerLevel.OFF
        }),
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        AppRouting,
        MatButtonModule,
        MatIconModule
    ],
    providers: [
        BroadcastService,
        AnalyticsService,
        MixpanelService,
        ImageService,
        VideoService,
        PlaylistService,
        UrlService,
        YoutubeService,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        }
    ],
    entryComponents: [
        PlaylistMediaComponent,
        VideoMediaComponent,
        ImageMediaComponent,
        UrlMediaComponent,
        WidgetMediaComponent,
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
