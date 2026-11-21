const isPlainObject = (value) =>
    value !== null && typeof value === 'object' && !Array.isArray(value);

const hasUuid = (value) => isPlainObject(value) && typeof value.uuid === 'string';

// Builds a copy only from the first entry that changed, so an unchanged state allocates nothing
const reuseEntries = (previous, keys, reuse, emptyCopy, sameSize) => {
    let result = sameSize ? null : emptyCopy();
    keys.forEach((key, index) => {
        const value = reuse(key);
        if (!result && value !== previous[key]) {
            result = emptyCopy();
            keys.slice(0, index).forEach((earlier) => {
                result[earlier] = previous[earlier];
            });
        }
        if (result) {
            result[key] = value;
        }
    });
    return result ?? previous;
};

const reuseArray = (previous, next) => {
    const previousByUuid = new Map();
    previous.forEach((item) => {
        if (hasUuid(item)) {
            previousByUuid.set(item.uuid, item);
        }
    });
    return reuseEntries(
        previous,
        next.map((_, index) => index),
        (index) => {
            const item = next[index];
            return reuseUnchanged(
                hasUuid(item) ? previousByUuid.get(item.uuid) : previous[index],
                item
            );
        },
        () => [],
        previous.length === next.length
    );
};

const reuseObject = (previous, next) => {
    const keys = Object.keys(next);
    return reuseEntries(
        previous,
        keys,
        (key) => reuseUnchanged(previous[key], next[key]),
        () => ({}),
        Object.keys(previous).length === keys.length
    );
};

export const reuseUnchanged = (previous, next) => {
    if (previous === next) {
        return previous;
    }
    if (Array.isArray(previous) && Array.isArray(next)) {
        return reuseArray(previous, next);
    }
    if (isPlainObject(previous) && isPlainObject(next)) {
        return reuseObject(previous, next);
    }
    return next;
};
