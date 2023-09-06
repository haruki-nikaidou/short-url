import { createSignal } from "solid-js";
import axios from "axios";
import "./App.css";
import Box from "./components/Box/Box";
import Button from "./components/Button/Button";
import TextField from "./components/TextField/TextField";

async function getShortUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        axios.post("/shorten", {
            originalUrl: url
        }).then((response) => {
            resolve(response.data["shortUrl"]);
        }).catch((error) => {
            reject(error);
        });
    });
}

export default function App() {
    const [shortUrl, setShortUrl] = createSignal("");
    const [longUrl, setLongUrl] = createSignal("");

    const longUrlChangeListener = (value: string) => {
        setLongUrl(value);
    };
    const onClickShortenButton = async () => {
        try {
            const shortUrl = await getShortUrl(longUrl());
            setShortUrl(shortUrl);
        } catch (error) {
            console.error(error);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            alert(error["message"]);
        }
    };
    const onClickCopyButton = () => {
        navigator.clipboard.writeText(shortUrl()).then(() => {});
    };

    return (
        <div class="content">
            <Box width="20em">
                <div class="column">
                    <h1>Shorten URL</h1>
                    <TextField placeholder="Enter URL Here" onChange={longUrlChangeListener}/>
                    <Button text="Shorten" onClick={onClickShortenButton} />
                    <TextField placeholder="Shortened URL" readonly value={shortUrl()}/>
                    <Button text="Copy" onClick={onClickCopyButton} />
                </div>
            </Box>
        </div>
    );
}
