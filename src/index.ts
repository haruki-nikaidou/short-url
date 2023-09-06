import express from "express";
import { generateShort } from "./util/generateShort";
import ShortUrl from "./util/database";

const app = express();
app.use(express.json());

app.post("/shorten", async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ error: "Missing originalUrl" });
    }
    const shortPath = generateShort(originalUrl);
    const shortUrl = new ShortUrl({ originalUrl, shortPath });
    shortUrl.save().then(() => {
        res.status(200).json({ shortPath });
    }).catch((err) => {
        res.status(400).json({ error: err.message });
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