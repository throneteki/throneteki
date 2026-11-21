import { create } from 'jsondiffpatch';

const differ = create({
    objectHash: (item, index) => item.uuid ?? item.id ?? `$$index:${index}`
});

// The state can hold live engine references, so keep a copy in the form the client receives
export const snapshotGameState = (state) => JSON.parse(JSON.stringify(state));

export const diffGameState = (previous, next) => differ.diff(previous, next);

export const patchGameState = (state, delta) => differ.patch(state, delta);

// A delta that adds items to the end of an array that already holds `start` items
export const appendDelta = (start, items) => ({
    _t: 'a',
    ...Object.fromEntries(items.map((item, index) => [start + index, [item]]))
});
