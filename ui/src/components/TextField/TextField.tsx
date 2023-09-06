import "./TextField.css";
import { createSignal } from "solid-js";

export interface TextFieldProps {
    placeholder?: string;
    readonly?: boolean;
    onChange?: (value: string) => void;
    value?: string;
}

export default function TextField(props: TextFieldProps) {
    const [value, setValue] = createSignal(props.value? props.value : "");
    const onChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setValue(target.value);
        if (props.onChange) {
            props.onChange(target.value);
        }
    };
    return (
        <input
            placeholder={props.placeholder}
            value={value()}
            onChange={onChange}
            class={"text-box"}
            readonly={props.readonly}
        />
    );
}