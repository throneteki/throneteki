import { parseListQuery } from '../../../server/api/problemReports.js';

describe('problem report list query', function () {
    function clientQuery(search) {
        const params = new URLSearchParams();
        params.append('pageSize', '20');
        params.append('pageNumber', '2');
        params.append('sorting[0].id', 'createdAt');
        params.append('sorting[0].desc', 'true');
        params.append('filters[0].id', 'search');
        params.append('filters[0].value', search);

        return params.toString();
    }

    it('keeps commas and ampersands in the search text', function () {
        const options = parseListQuery(clientQuery('Hmm, nothing & then 50% STR'));

        expect(options.filters).toEqual([{ id: 'search', value: 'Hmm, nothing & then 50% STR' }]);
    });

    it('reads paging and sorting', function () {
        const options = parseListQuery(clientQuery('meryn'));

        expect(options.pageSize).toBe('20');
        expect(options.pageNumber).toBe('2');
        expect(options.sorting).toEqual([{ id: 'createdAt', desc: 'true' }]);
    });

    it('accepts an empty query', function () {
        expect(parseListQuery(undefined)).toEqual({});
    });
});
