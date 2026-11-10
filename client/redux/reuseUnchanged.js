const isPlainObject = (value) =>
    value !== null && typeof value === 'object' && !Array.isArray(value);

const hasUuid = (value) => isPlainObject(value) && typeof value.uuid === 'string';

const reuseArray = (previous, next) => {
    const previousByUuid = new Map();
    previous.forEach((item) => {
        if (hasUuid(item)) {
            previousByUuid.set(item.uuid, item);
        }
    });

    const result = next.map((item, index) =>
        reuseUnchanged(hasUuid(item) ? previousByUuid.get(item.uuid) : previous[index], item)
    );

    return result.length === previous.length && result.every((item, i) => item === previous[i])
        ? previous
        : result;
};

const reuseObject = (previous, next) => {
    const nextKeys = Object.keys(next);
    const result = {};
    nextKeys.forEach((key) => {
        result[key] = reuseUnchanged(previous[key], next[key]);
    });

    const previousKeys = Object.keys(previous);
    return previousKeys.length === nextKeys.length &&
        nextKeys.every((key) => result[key] === previous[key])
        ? previous
        : result;
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
