import "./App.css";
import Box from "./components/Box/Box";
import Button from "./components/Button/Button";
import TextField from "./components/TextField/TextField";


export default function App() {
    return (
        <div class="content">
            <Box width="20em">
                <div class="column">
                    <h1>Shorten URL</h1>
                    <TextField placeholder="Enter URL Here" />
                    <Button text="Shorten" />
                    <TextField placeholder="Shortened URL" readonly />
                    <Button text="Copy" />
                </div>
            </Box>
        </div>
    );
}
