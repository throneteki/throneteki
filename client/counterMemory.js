// The last value each counter on the board showed, by card and counter. A card that moves is drawn again from
// scratch, so its counters would otherwise look newly placed. Counters on the board when it is first drawn were
// already there.
const values = new Map();
const holders = new Map();
let boardShown = false;

export const showBoard = () => {
    boardShown = true;
};

export const forgetBoard = () => {
    boardShown = false;
    values.clear();
    holders.clear();
};

export const remember = (id, value) => values.set(id, value);

export const hold = (id) => holders.set(id, (holders.get(id) ?? 0) + 1);

// A counter that is drawn again elsewhere in the same update keeps its value; one that is gone is forgotten,
// so if it comes back later it is placed again
export const release = (id) => {
    holders.set(id, (holders.get(id) ?? 1) - 1);
    setTimeout(() => {
        if (!holders.get(id)) {
            holders.delete(id);
            values.delete(id);
        }
    }, 0);
};

// How a counter first shows its value: as it was, as a change from what it last showed, or placed fresh.
// Tokens placed fresh count up one at a time from 1.
export const firstSight = (id, value, countsUp) => {
    if (values.has(id)) {
        return { previous: values.get(id), shown: value };
    }
    if (!boardShown) {
        return { previous: value, shown: value };
    }
    const countFrom = countsUp && typeof value === 'number' && value > 1 ? 1 : value;
    return { previous: undefined, placed: true, shown: countFrom };
};
