import {createSignal, Setter} from "solid-js";
import "./Select.css";

type selectItems = string[];
interface SelectProps {
    items: selectItems;
    onChange?: (index: number) => void;
    selected?: number;
}

export default function Select(props: SelectProps) {
    const [selected, setSelected] = createSignal(props.selected ?? 0);
    const { items } = props;
    const selectItems = [];
    const allSelectedSetter: Setter<boolean>[] = [];
    for (const [index, item] of items.entries()) {
        const [isSelected, setIsSelected] = createSignal(false);
        allSelectedSetter.push(setIsSelected);
        if (index === selected()) {
            setIsSelected(true);
        }
        const onClick = () => {
            setSelected(index);
            for (const setter of allSelectedSetter) {
                setter(false);
            }
            setIsSelected(true);
            props.onChange?.(index);
        };
        selectItems.push(
            <button
                class={ "select-item" + " " + (isSelected() ? "selected":"") }
                onClick={onClick}
            >
                {item}
            </button>
        );
    }
    return (
        <div class="select">
            {selectItems}
        </div>
    );
}