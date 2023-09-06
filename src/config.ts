import type Config from "./types/config.ts";

export default <Config> {
    mongodb: {
        uri: "mongodb://localhost:27017",
        dbName: "shorter",
    }
};