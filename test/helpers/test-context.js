// Specs use `this` to share state between hooks and tests. Each test gets a fresh context, seeded
// from anything its suite's beforeAll put on `this`.
//
// The setup file runs once per spec file but imported modules are cached across files, so the
// original vitest globals are captured once and the root hooks are registered on every install.

let sharedContext = {};
let context = {};

const original = (globalThis.__vitestOriginalGlobals ??= {
    it: globalThis.it,
    beforeEach: globalThis.beforeEach,
    afterEach: globalThis.afterEach,
    beforeAll: globalThis.beforeAll,
    afterAll: globalThis.afterAll
});

const testContext = () => context;
const suiteContext = () => sharedContext;

function bind(fn, getContext) {
    return fn && (() => fn.call(getContext()));
}

function wrapTest(testFn) {
    const wrapped = (name, fn, timeout) => testFn(name, bind(fn, testContext), timeout);
    wrapped.skip = (name, fn, timeout) => testFn.skip(name, bind(fn, testContext), timeout);
    wrapped.only = (name, fn, timeout) => testFn.only(name, bind(fn, testContext), timeout);
    wrapped.todo = testFn.todo;
    return wrapped;
}

function wrapHook(hookFn, getContext) {
    return (fn, timeout) => hookFn(bind(fn, getContext), timeout);
}

export function install() {
    original.beforeAll(() => {
        sharedContext = {};
    });
    original.beforeEach(() => {
        context = Object.assign({}, sharedContext);
    });

    globalThis.it = wrapTest(original.it);
    globalThis.beforeEach = wrapHook(original.beforeEach, testContext);
    globalThis.afterEach = wrapHook(original.afterEach, testContext);
    globalThis.beforeAll = wrapHook(original.beforeAll, suiteContext);
    globalThis.afterAll = wrapHook(original.afterAll, suiteContext);
}

export function currentTestContext() {
    return context;
}
