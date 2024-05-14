class Matcher {
    /**
     * Returns true if the expected value exists and equals the actual value. If
     * the expected value is an array, it returns true if the actual value is
     * contained in that array.
     */
    static containsValue(expected, actualFunc) {
        if (expected === undefined) {
            return true;
        }

        if (Array.isArray(expected)) {
            return expected.includes(actualFunc());
        }

        return expected === actualFunc();
    }

    /**
     * Returns true if the expected value exists and matches the passed
     * predicate function. If the expected value is an array, it returns true if
     * at least one value in the array matches the passed predicate function.
     */
    static anyValue(expected, predicate) {
        if (expected === undefined) {
            return true;
        }

        if (Array.isArray(expected)) {
            return expected.some((value) => predicate(value));
        }

        return predicate(expected);
    }
}

export default Matcher;
