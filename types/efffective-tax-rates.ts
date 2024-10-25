import { EffectiveTaxRate as PrismaEffectiveTaxRate } from "@prisma/client";

export type EffectiveTaxRateRequest = PrismaEffectiveTaxRate & {
}

export type EffectiveTaxRateResponse = PrismaEffectiveTaxRate & {
}

export type EffectiveTaxRate = {
    id: string;
    state: string;
    country: string;
    medianHomeValue: number | null;
    medianAnnualPropertyTaxPayment: number | null;
    averageEffectivePropertyTaxRate: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}