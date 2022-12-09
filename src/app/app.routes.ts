import { Routes } from '@angular/router';

import { SplashComponent } from './splash/splash.component';
import { BroadcastLoaderComponent } from './broadcast-loader/broadcast-loader.component';
import { PlaylistLoaderComponent } from './playlist-loader/playlist-loader.component';
import { VideoLoaderComponent } from './video-loader/video-loader.component';
import { ImageLoaderComponent } from './image-loader/image-loader.component';
import { YoutubeLoaderComponent } from './youtube-loader/youtube-loader.component';
import { DemoLoaderComponent } from './demo-loader/demo-loader.component';
import { UrlLoaderComponent } from './url-loader/url-loader.component';


export const AppRoutes: Routes = [
    { path: 'demo', component: DemoLoaderComponent },
    { path: 'broadcast/:id', component: BroadcastLoaderComponent },
    { path: 'playlists/:id', component: PlaylistLoaderComponent },
    { path: 'videos/:id', component: VideoLoaderComponent },
    { path: 'images/:id', component: ImageLoaderComponent },
    { path: 'urls/:id', component: UrlLoaderComponent },
    { path: 'youtube/:id', component: YoutubeLoaderComponent },
    { path: '**', component: SplashComponent }
];
