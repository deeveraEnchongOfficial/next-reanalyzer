export type EventLog = {
    id?: string;
    event: string;
    userId?: string;
    app?: { 
        page?: string;
        source?: string;
    }
    api?: {
        endpoint?: string;
        method?: string;
        status?: string;
        error?: string;
    }
}

export type EventLogRequest = EventLog & {
}

export type EventLogResponse = EventLog & {
}