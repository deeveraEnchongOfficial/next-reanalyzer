import { AffiliateLink } from "@prisma/client";

export type AffiliateLinkRequest = AffiliateLink & {
}

export type AffiliateLinkResponse = AffiliateLink & {
}

export type AppAffiliateLink = {
    id: string              
    normalLink: string;
    affiliateLink: string;
    isActive: boolean;             
    type: string;
    programLink: string;
    programNotes: string;
}