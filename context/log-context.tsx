"use client"
import { createContext, ReactNode, useContext } from 'react';
import { EventLogRequest } from '@/types/event-log';
import { ResponseError } from "@/errors/responseError";
import { createEventLog } from '@/actions/event-log';

interface LogContextType {
    logEvent: (request: EventLogRequest) => Promise<void>;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider = ({ children }: { children: ReactNode }) => {
    const logEvent = async (request: EventLogRequest) => {
        try {
            // await createLog(logRequest);
            await createEventLog(request);
        } catch (error) {
        if (error instanceof ResponseError) {
            throw new ResponseError(error.message, error.status);
        } else {
            throw new Error(error?.toString());
        }
        }
    };

    return (
        <LogContext.Provider value={{ logEvent }}>
            {children}
        </LogContext.Provider>
    );
};

export const useLog = (): LogContextType => {
    const context = useContext(LogContext);
    if (!context) {
        throw new Error('useLog must be used within a LogProvider');
    }
    return context;
};
