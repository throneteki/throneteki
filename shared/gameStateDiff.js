import { create } from 'jsondiffpatch';

const differ = create({
    objectHash: (item, index) => item?.uuid ?? item?.id ?? `$$index:${index}`
});

export const snapshotGameState = (state) => JSON.parse(JSON.stringify(state));

export const diffGameState = (previous, next) => differ.diff(previous, next);

export const patchGameState = (state, delta) => differ.patch(state, delta);

export const appendDelta = (start, items) => ({
    _t: 'a',
    ...Object.fromEntries(items.map((item, index) => [start + index, [item]]))
});
