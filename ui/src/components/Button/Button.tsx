import "./Button.css";

type ButtonProps = {
    onClick?: () => void;
    text: string;
}

export default function Button(props: ButtonProps) {
    return (
        <button
            class={"button"}
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
}