export const MaxFilterValueLength = 100;

export function escapeLike(value) {
    return String(value)
        .substring(0, MaxFilterValueLength)
        .replace(/[\\%_]/g, (character) => `\\${character}`);
}

function filterValues(value) {
    const values = Array.isArray(value) ? value : [value];

    return values.filter((val) => val !== undefined && val !== null && typeof val !== 'object');
}

export function getRequestedFilters(options, filterableFields) {
    return (Array.isArray(options.filters) ? options.filters : [])
        .filter((filter) => filter && filterableFields.includes(filter.id))
        .map((filter) => ({ id: filter.id, values: filterValues(filter.value) }))
        .filter((filter) => filter.values.length > 0);
}

export function getOrder(options, sortColumns, defaultOrder) {
    const requestedSort = Array.isArray(options.sorting) ? options.sorting[0] : undefined;

    return requestedSort && sortColumns[requestedSort.id]
        ? `${sortColumns[requestedSort.id]} ${requestedSort.desc === 'true' ? 'DESC' : 'ASC'}`
        : defaultOrder;
}

export function getPaging(options, maxPageSize) {
    const page = Math.max(parseInt(options.pageNumber, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(options.pageSize, 10) || 10, 1), maxPageSize);

    return { page, pageSize, offset: (page - 1) * pageSize };
}
