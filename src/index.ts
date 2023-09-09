import express from "express";
import { generateShort } from "./util/generateShort";
import ShortUrl from "./util/database";
import path from "path";
import {ErrorResponse, ExpireUnit} from "./types/request";

const app = express();
app.use(express.json());

const uiPath = path.join(__dirname, "../ui/dist");

function isValidUrl(urlString: string): boolean {
    try {
        new URL(urlString);
        return true;
    } catch (e) {
        return false;
    }
}

function getExpireDate(expiresAt: ExpireUnit): Date | undefined {
    const today = new Date();
    switch (expiresAt) {
    case ExpireUnit["1day"]:
        return new Date(today.setDate(today.getDate() + 1));
    case ExpireUnit["3days"]:
        return new Date(today.setDate(today.getDate() + 3));
    case ExpireUnit.week:
        return new Date(today.setDate(today.getDate() + 7));
    case ExpireUnit.never:
        return undefined;
    }
}

app.post("/shorten", async (req, res) => {
    // get originalUrl and expiresAt from req.body
    const { originalUrl } = req.body;
    let { expiresAt } = req.body;

    // validate originalUrl
    if (!originalUrl) {
        return res.status(400).json({ error: ErrorResponse["Missing originalUrl"] });
    }
    if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ error: ErrorResponse["Invalid originalUrl"] });
    }

    // validate expiresAt
    if (!expiresAt) {
        expiresAt = ExpireUnit["1day"]; // default
    }
    if (!Object.values(ExpireUnit).includes(expiresAt)) {
        return res.status(400).json({ error: ErrorResponse["Invalid expiresAt"] });
    }

    // if originalUrl already exists, return shortPath and renew expiresAt
    const tryToFindResult = await ShortUrl.findOne({ originalUrl });
    if (tryToFindResult) {
        tryToFindResult.expireAt = getExpireDate(expiresAt);
        tryToFindResult.save();
        return res.status(200).json({ shortPath: tryToFindResult.shortPath });
    }

    // if originalUrl does not exist, generate shortPath and save to database
    const shortPath = generateShort(originalUrl);
    const shortUrl = new ShortUrl({
        originalUrl,
        shortPath,
        expireAt: getExpireDate(expiresAt)
    });
    shortUrl.save().then(() => {
        res.status(200).json({ shortPath });
    }).catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.message });
    });
});

app.get("/assets/:filename", async (req, res) => {
    const {filename} = req.params;
    const filePath = path.join(uiPath, "assets", filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.log(err);
            res.status(404).json({ error: "File not found" });
        }
    });
});

app.get("/", async (req, res) => {
    const htmlPath = path.join(uiPath, "index.html");
    res.sendFile(htmlPath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });
});

app.get("/favicon.svg", async (req, res) => {
    const path = uiPath + "/favicon.svg";
    res.sendFile(path, (err) => {
        if (err) {
            console.error(err);
            res.status(404).json({ error: "File not found" });
        }
    });
});

app.get("/:shortPath", async (req, res) => {
    const { shortPath } = req.params;
    const shortUrl = await ShortUrl.findOne({ shortPath });
    if (!shortUrl) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    const { originalUrl } = shortUrl;
    if (!originalUrl) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    res.redirect(originalUrl);
});

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});