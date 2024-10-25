import { SubPlan } from "@prisma/client";

export type SubPlanRequest = SubPlan & {
}

export type SubPlanResponse = SubPlan & {
}

export type AppSubPlan = {
    id: string              
    name: string
    isActive: boolean;             
    isFree: boolean;                 
    aiTokenLimitPerDay: number;
    aiTokenLimitPerMonth: number;
    aiTokenLimitPerYear: number;
    realApiLimitPerDay: number;
    realApiLimitPerMonth: number;
    realApiLimitPerYear: number;
}