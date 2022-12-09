
export interface IPlayable {

    title: string;

    lastModified(): Date;

    play(): void;

    stop(): void;

    mediaType(): string;
}

export class UnknownPlayable implements IPlayable {

    title: string;

    lastModified(): Date { return new Date(0); }

    play(): void { }

    stop(): void { }

    mediaType(): string { return 'none'; }
}
