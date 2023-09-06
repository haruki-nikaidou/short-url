type ShortUrlState = string;
type ShortUrlAction = { type: "SHORT_URL"; payload: string };

export default function shortUrlReducer(state = "", action: ShortUrlAction): ShortUrlState {
    switch (action.type) {
    case "SHORT_URL":
        return action.payload;
    default:
        return state;
    }
}