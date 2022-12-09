export interface IWidget {
    id: string;
    title: string;
    description: string;
    type: string;
    payload: { [key: string]: string };
}

