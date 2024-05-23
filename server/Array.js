export function flatten(array) {
    return array.reduce((result, element) => {
        if (Array.isArray(element)) {
            return result.concat(flatten(element));
        }

        return result.concat(element);
    }, []);
}

export function flatMap(array, mapFunc) {
    return flatten(array.map(mapFunc));
}

export function partition(array, filterFunc) {
    let matches = [];
    let remaining = [];

    for (let item of array) {
        if (filterFunc(item)) {
            matches.push(item);
        } else {
            remaining.push(item);
        }
    }

    return [matches, remaining];
}

export function sortByComparison(transform) {
    return function (a, b) {
        let aValue = transform(a);
        let bValue = transform(b);

        if (aValue > bValue) {
            return 1;
        }

        if (aValue < bValue) {
            return -1;
        }

        return 0;
    };
}

export function sortBy(array, transform) {
    return [...array].sort(sortByComparison(transform));
}
/**
 * Returns the elements of an array that are available for pairing after
 * considering all possible pair combinations with another array.
 *
 * @param {any[]} array1 The array to find which elements are available on
 * @param {any[]} array2 The array to compare to
 * @param {function(any, any)} canPair The function to compair elements from array1 & array2
 */
export function availableToPair(array1, array2, canPair) {
    let a1indecies = array1.map((_a1element, index) => index);
    let available = [];
    // 'Permutation' results in a list of a1indecies in every possible ordered combination. Eg. [[0,1,2], [0,2,1], ... , [2,1,0]]
    permutate([], [], a1indecies).every((permutation) => {
        // If every a1index can either: not be paired with an array2 element (meaning its available),
        // OR can be paired with the array2 element of that permutation index, then we can add the available array1 elements
        if (
            permutation.every(
                (a1index, pindex) =>
                    pindex >= array2.length || canPair(array1[a1index], array2[pindex])
            )
        ) {
            // Only add array1 elements which are not already on the available list AND are available (same as above)
            available = available.concat(
                permutation
                    .filter(
                        (a1index, pindex) =>
                            !available.includes(array1[a1index]) && pindex >= array2.length
                    )
                    .map((a1index) => array1[a1index])
            );
        }
        // Exit early (return false) if all array1 elements are available
        return available.length < array1.length;
    });
    return available;
}

// Each element of 'array' in every possible ordered combination
function permutate(permutations, current, array) {
    if (array.length > 0) {
        array.forEach((e, index) => {
            var next = [...current];
            next.push(e);
            var remaining = [...array];
            remaining.splice(index, 1);
            permutate(permutations, next, remaining);
        });
    } else {
        permutations.push(current);
    }
    return permutations;
}

export function equalElements(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    } else {
        let result = false;
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            } else {
                result = true;
            }
        }
        return result;
    }
}
