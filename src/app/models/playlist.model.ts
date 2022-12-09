
import { IPlaylistItem } from './playlistitem.model';

export interface IPlaylist {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    durationSecs: number;
    items: IPlaylistItem[];
    accountId: string;
    createdAt: string;
    updatedAt: string;
    creatorId: string;
}
