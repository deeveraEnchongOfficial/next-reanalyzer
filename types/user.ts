import { User, UserRole } from "@prisma/client";

// export type User = {
//     id                      String;                 
//     name?                    String;
//     email?                   String;                
//     emailVerified?           DateTime;
//     image?                   String;
//     password?                String;
//     role                    UserRole               
//     accounts                Account[]
//     isTwoFactorEnabled      Boolean                
//     twoFactorConfirmation?   TwoFactorConfirmation?
//     twoFactorConfirmationId? String?                
//     discount?                Float?
//     monthlyTotal?            Float?
//     subscriptions           Subscription[]
//     eventLogs               EventLog[]
// }

export type UserRequest = User & {
}

export type UserResponse = User & {
}

export type AppUser = {
    id: string;
    userName: string;
    password: string;
    email: string;
    name: string;
    isActive: boolean;
    subscriptionType: string;
    discount: number;
    monthlyTotal: number;
    aiApiInToken: number;
    aiApiOutToken: number;
    realApiCalls: number;
    role: UserRole;
}