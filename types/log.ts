export type LogRequest = {
    id?: string;
    type: string;
    page?: string;
    source?: string;
    endpoint?: string;
    userId: string;
}

export type LogResponse = {
    id?: string;
    type: string;
    page?: string;
    source?: string;
    endpoint?: string;
    userId: string;
}