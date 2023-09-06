import { configureStore } from "@reduxjs/toolkit";
import longUrlReducer from "./reducers/longUrlReducer";
import shortUrlReducer from "./reducers/shortUrlReducer";

const store = configureStore({
    reducer: {
        longUrl: longUrlReducer,
        shortUrl: shortUrlReducer,
    },
});

