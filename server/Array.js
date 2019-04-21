function flatten(array) {
    return array.reduce((result, element) => {
        if(Array.isArray(element)) {
            return result.concat(flatten(element));
        }

        return result.concat(element);
    }, []);
}

function flatMap(array, mapFunc) {
    return flatten(array.map(mapFunc));
}

module.exports = {
    flatten,
    flatMap
};
