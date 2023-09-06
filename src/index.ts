import express from "express";
import { generateShort } from "./util/generateShort";
import ShortUrl from "./util/database";
import path from "path";

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

app.post("/shorten", async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ error: "Missing originalUrl" });
    }
    if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ error: "Invalid originalUrl" });
    }
    const tryToFindResult = await ShortUrl.findOne({ originalUrl });
    if (tryToFindResult) {
        return res.status(200).json({ shortPath: tryToFindResult.shortPath });
    }
    const shortPath = generateShort(originalUrl);
    const shortUrl = new ShortUrl({ originalUrl, shortPath });
    shortUrl.save().then(() => {
        res.status(200).json({ shortPath });
    }).catch((err) => {
        console.error(err);
        res.status(400).json({ error: err.message });
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