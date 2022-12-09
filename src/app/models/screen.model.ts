export interface IScreen {
    id: string;
    name: string;
    description: string;
    channelId: string;
    locationId: string;
    accountId: string;
    createdAt: string;
    updatedAt: string;
    creatorId: string;
    timezone: string;
    hardwareId: string;
    deviceModel: string;
    serialNumber: string;
    diagonalInches: number;
    aspectRatio: string;
    orientation: string;
    elevationFeet: number;
    heightPixels: number;
    estAudienceCoverage: number;
    countAudienceStart?: number; // number of seconds in day to start counting (<24*60*60)
    countAudienceDuration?: number; // number of seconds in day to keep counting (<24*60*60)
    countAudiencePeriod?: number; // number of seconds between audience checks
}
