import { createHash } from "crypto";

function sha1(data: string): string {
    const hash = createHash("sha1");
    hash.update(data);
    return hash.digest("base64url");
}

export function generateShort (url: string): string {
    const sha= sha1(url).slice(0, 6);
    const randomNumber = Math.floor(Math.random() * 1000000);
    const randomNumberString = randomNumber.toString(16).slice(0, 3);
    return sha + randomNumberString;
}