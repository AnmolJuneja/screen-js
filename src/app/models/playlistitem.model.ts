export interface IPlaylistItem {
    id: string;
    position: number;
    itemType: string;
    itemId: string;
    item?: any;
    startTime: number;
    durationSecs: number;
    createdAt: string;
    updatedAt: string;
    playlistId: string;
}
