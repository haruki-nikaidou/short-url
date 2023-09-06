import config from "../config";
import mongoose from "mongoose";

const { uri, dbName } = config.mongodb;
mongoose.connect(`${uri}/${dbName}`).then(() => {
    console.log("Connected to MongoDB");
});

const shortUrlSchema = new mongoose.Schema({
    originalUrl: String,
    shortPath: {
        type: String,
        unique: true,
    },
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;