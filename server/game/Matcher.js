class Matcher {
    /**
     * Returns true if the expected value exists and equals the actual value. If
     * the expected value is an array, it returns true if the actual value is
     * contained in that array.
     */
    static containsValue(expected, actual) {
        if(expected === undefined) {
            return true;
        }

        if(Array.isArray(expected)) {
            return expected.includes(actual);
        }

        return expected === actual;
    }

    /**
     * Returns true if the expected value exists and matches the passed
     * predicate function. If the expected value is an array, it returns true if
     * at least one value in the array matches the passed predicate function.
     */
    static anyValue(expected, predicate) {
        if(expected === undefined) {
            return true;
        }

        if(Array.isArray(expected)) {
            return expected.some(value => predicate(value));
        }

        return predicate(expected);
    }
}

module.exports = Matcher;
