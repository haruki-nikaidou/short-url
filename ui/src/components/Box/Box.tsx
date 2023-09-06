import { JSX } from "solid-js";
import "./Box.css";

export interface BoxProps {
    children?: JSX.Element | JSX.Element[];
    height?: string;
    width?: string;
}

export default function Box(props: BoxProps) {
    return (
        <div
            style={{
                height: props.height,
                width: props.width,
            }}
            class={"Box"}
        >
            {props.children}
        </div>
    );
}