export interface IImage {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    imageUrl: string;
    mimeType: string;
    width: number;
    height: number;
    fileSizeBytes: number;
    createdAt: string;
    updatedAt: string;
    creatorId: string;
    accountId: string;
}
