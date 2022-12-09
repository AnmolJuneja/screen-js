import { IImage } from './image.model';
import { IVideo } from './video.model';
import { IUrl } from './url.model';
import { IPlaylistItem } from './playlistitem.model';
import { IPlaylist } from './playlist.model';
import { IScreen } from './screen.model';
import { IChannel } from './channel.model';
import { IScheduledContent } from 'app/models/scheduled-content.model';
import { IWidget } from './widget.model';

export interface IBroadcast {
    screen: IScreen;
    channel: IChannel;
    scheduledContent: IScheduledContent[];
    playlists: IPlaylist[];
    images: IImage[];
    videos: IVideo[];
    urls?: IUrl[];
    updatedAt: string;
    ip: string;
    ips: string[];
    widgets?: IWidget[];
}
