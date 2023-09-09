import { JSX } from "solid-js";
import "./Box.css";

export interface BoxProps {
    children?: JSX.Element | JSX.Element[];
    extraStyle?: JSX.CSSProperties;
}

export default function Box(props: BoxProps) {
    return (
        <div
            style={props.extraStyle}
            class={"Box"}
        >
            {props.children}
        </div>
    );
}