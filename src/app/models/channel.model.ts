import { IPlaylist } from './playlist.model';

export interface IChannel {
    id: string;
    name: string;
    description: string;
    defaultPlaylistId: string;
    defaultPlaylist?: IPlaylist;
    accountId: string;
    createdAt: string;
    updatedAt: string;
    creatorId: string;
}
