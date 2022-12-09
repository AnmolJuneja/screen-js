export interface IVideo {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    contentUrl: string;
    mimeType: string;
    width: number;
    height: number;
    fileSizeBytes: number;
    durationSecs: number;
    createdAt: string;
    updatedAt: string;
    creatorId: string;
    accountId: string;
}
