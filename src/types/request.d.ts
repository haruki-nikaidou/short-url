export type addUrlRequest = {
    originalUrl: string;
}

export enum ExpireUnit {
    "1day", "3days" , "week", "never"
}

export type addUrlResponse = {
    shortPath: string;
    expiresAt: ExpireUnit;
};

export enum ErrorResponse {
    "Missing originalUrl", "Invalid originalUrl", "Internal server error"
}