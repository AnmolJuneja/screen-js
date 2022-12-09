import { IPlaylist } from './playlist.model';

export interface IScheduledContent {
    id: string;
    colorName: string;
    startDatetime: string;
    duration: string;
    repetitions: number;
    recurranceRule: string;
    accountId: string;
    playlistId: string;
    channelId: string;
    createdAt: string;
    updatedAt: string;
    playlist?: IPlaylist;
}
