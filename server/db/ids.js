export function idColumn(id) {
    return /^\d{1,18}$/.test(String(id)) ? 'id' : 'mongo_id';
}
