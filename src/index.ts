import express from "express";
import { generateShort } from "./util/generateShort";
import ShortUrl from "./util/database";

const app = express();
app.use(express.json());

const uiPath = __dirname + "/../ui/dist";

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

app.get("/asserts/:filename", async (req, res) => {
    const {filename} = req.params;
    const path = uiPath + "/asserts/" + filename;
    res.sendFile(path, (err) => {
        if (err) {
            res.status(404).json({ error: "File not found" });
        }
    });
});

app.get("/", async (req, res) => {
    const path = uiPath + "/index.html";
    res.sendFile(path, (err) => {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
});

app.get("/favicon.ico", async (req, res) => {
    const path = uiPath + "/favicon.ico";
    res.sendFile(path, (err) => {
        if (err) {
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