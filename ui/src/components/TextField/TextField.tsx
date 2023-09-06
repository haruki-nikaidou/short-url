import "./TextField.css";
import { Accessor, createSignal } from "solid-js";

export interface TextFieldProps {
    placeholder?: string;
    readonly?: boolean;
    onChange?: (value: string) => void;
    value?: string | Accessor<string>;
}

export default function TextField(props: TextFieldProps) {

    if (props.readonly) {
        if (typeof props.value === "string") {
            throw new Error("Cannot use readonly with string value");
        }
        return (
            <input
                placeholder={props.placeholder}
                value={props.value!()}
                class={"text-box"}
                readonly={props.readonly}
            />
        );
    }

    let [value, setValue] = createSignal("");
    
    if (typeof props.value === "string") {
        [value, setValue] = createSignal(props.value);
    }
    if (typeof props.value === "function") {
        [value, setValue] = createSignal(props.value());
    }
    
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