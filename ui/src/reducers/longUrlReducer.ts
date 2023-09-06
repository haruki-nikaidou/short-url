type LongUrlState = string;
type LongUrlAction = { type: "LONG_URL"; payload: string };

export default function longUrlReducer(state = "", action: LongUrlAction): LongUrlState {
    switch (action.type) {
    case "LONG_URL":
        return action.payload;
    default:
        return state;
    }
}