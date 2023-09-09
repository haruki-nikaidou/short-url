import { createSignal } from "solid-js";
import axios from "axios";
import "./App.css";
import Box from "./components/Box/Box";
import Button from "./components/Button/Button";
import TextField from "./components/TextField/TextField";
import Select from "./components/Select/Select.tsx";

async function getShortUrl(url: string): Promise<string> {
    const urlBase = window.location.href;
    return new Promise((resolve, reject) => {
        axios.post("/shorten", {
            originalUrl: url
        }).then((response) => {
            resolve(urlBase + response.data["shortPath"]);
        }).catch((error) => {
            reject(error);
        });
    });
}

const expireTimeOptions = [
    "1d",
    "3d",
    "7d",
    "Never"
];

export default function App() {
    const [shortUrl, setShortUrl] = createSignal("");
    const [longUrl, setLongUrl] = createSignal("");

    const longUrlChangeListener = (value: string) => {
        setLongUrl(value);
    };
    const onClickShortenButton = async () => {
        try {
            const shortenUrl = await getShortUrl(longUrl());
            setShortUrl(shortenUrl);
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
                    <h3>Link expiration</h3>
                    <Select items={expireTimeOptions} />
                    <Button text="Shorten" onClick={onClickShortenButton} />
                    <TextField placeholder="Shortened URL" readonly value={shortUrl}/>
                    <Button text="Copy" onClick={onClickCopyButton} />
                </div>
            </Box>
        </div>
    );
}
