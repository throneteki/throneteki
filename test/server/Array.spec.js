import { flatten, flatMap } from '../../server/Array.js';

describe('ArrayHelpers', function () {
    describe('flatten', function () {
        it('handles unnested nested arrays', function () {
            expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
        });

        it('handles shallowly nested arrays', function () {
            expect(flatten([[1, 2], [3]])).toEqual([1, 2, 3]);
        });

        it('handles deeply nested arrays', function () {
            expect(flatten([1, [2, 3], [4, [5, 6]]])).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });

    describe('flatMap', function () {
        it('maps the values then flattens the resulting array', function () {
            let data = [{ value: 1 }, { value: [2, 3] }, { value: [[4], [5, 6]] }];
            expect(flatMap(data, (item) => item.value)).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
});
