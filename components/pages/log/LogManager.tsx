'use client'
import React, { useEffect, useState } from "react";
import { ResponseError } from "@/errors/responseError";
import { useLog } from "@/context/log-context";
import { getData } from "@/helpers/apiHelpers";

const LogManager: React.FC = () => {
    const { logEvent } = useLog();

    const handleCreateLog = async () => {
        try {
            logEvent({
                event: "AppEvent",
                app: {
                    page: "/log",
                    source: "load"
                }
            });
          } catch (error) {
            if (error instanceof ResponseError) {
                console.log(error.message);
            } else {
                console.log(error?.toString())
            }
          }
    };
    
    useEffect(() => {
        const setLogs = async () => {
            const logs = await getData("logs");

            console.log(logs)
        };

        setLogs();
    }, []);
    
    return (
        <div>
            <h1>Log Manager</h1>
            <button onClick={handleCreateLog}>Create Log</button>
        </div>
    );
};

export default LogManager;
