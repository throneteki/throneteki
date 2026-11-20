import {
    computeHudScales,
    computeScreenScale,
    defaultHud,
    isHudSize,
    normalizeHud,
    resolveHudSize,
    promptSideOf
} from '../../client/hud.js';

describe('resolveHudSize', function () {
    it('maps presets per kind', function () {
        expect(resolveHudSize('cards', 'normal')).toBe(1);
        expect(resolveHudSize('cards', 'small')).toBe(0.7);
        expect(resolveHudSize('interface', 'large')).toBe(1.2);
    });

    it('accepts custom values clamped to the kind range', function () {
        expect(resolveHudSize('cards', '1.25')).toBe(1.25);
        expect(resolveHudSize('cards', '40')).toBe(5);
        expect(resolveHudSize('interface', '0.1')).toBe(0.6);
        expect(resolveHudSize('interface', '9')).toBe(2);
    });

    it('falls back to normal for unknown values', function () {
        expect(resolveHudSize('cards', 'huge')).toBe(1);
        expect(resolveHudSize('interface', '')).toBe(1);
    });
});

describe('isHudSize', function () {
    it('accepts presets and plain numbers only', function () {
        expect(isHudSize('cards', 'small')).toBe(true);
        expect(isHudSize('cards', '1.5')).toBe(true);
        expect(isHudSize('cards', 'auto')).toBe(false);
        expect(isHudSize('cards', undefined)).toBe(false);
        expect(isHudSize('cards', '0')).toBe(false);
    });
});

describe('normalizeHud', function () {
    it('defaults everything to normal with auto on', function () {
        expect(normalizeHud(undefined)).toEqual(defaultHud);
        expect(normalizeHud({})).toEqual({
            cards: 'normal',
            interface: 'normal',
            auto: true,
            animations: true,
            board: 'classic'
        });
    });

    it('keeps valid saved values and ignores invalid ones', function () {
        expect(normalizeHud({ hud: { cards: 'large', interface: 'bogus', auto: false } })).toEqual({
            cards: 'large',
            interface: 'normal',
            auto: false,
            animations: true,
            board: 'classic'
        });
        expect(normalizeHud({ hud: { animations: false } }).animations).toBe(false);
    });

    it('keeps a known board layout and ignores anything else', function () {
        expect(normalizeHud({ hud: { board: 'adaptive' } }).board).toBe('adaptive');
        expect(normalizeHud({ hud: { board: 'classic' } }).board).toBe('classic');
        expect(normalizeHud({ hud: { board: 'fancy' } }).board).toBe('classic');
        expect(normalizeHud({ hud: { board: 1 } }).board).toBe('classic');
    });

    it('defaults the legacy card size setting to the classic board', function () {
        expect(normalizeHud({ cardSize: 'large' })).toMatchObject({
            board: 'classic'
        });
    });

    it('migrates the earlier separate elements and text sizes', function () {
        expect(normalizeHud({ hud: { elements: 'large', text: 'small' } }).interface).toBe('large');
        expect(normalizeHud({ hud: { elements: 'normal', text: 'small' } }).interface).toBe(
            'small'
        );
    });

    it('migrates the legacy card size setting', function () {
        expect(normalizeHud({ cardSize: 'auto' })).toEqual(defaultHud);
        expect(normalizeHud({ cardSize: 'large' })).toMatchObject({ cards: 'large', auto: false });
        expect(normalizeHud({ cardSize: 'x-large' })).toMatchObject({ cards: '2', auto: false });
    });
});

describe('computeScreenScale', function () {
    it('is smaller on phones and larger on big screens within limits', function () {
        expect(computeScreenScale({ width: 390, height: 800 })).toBe(0.8);
        expect(computeScreenScale({ width: 1600, height: 950 })).toBe(1);
        expect(computeScreenScale({ width: 5000, height: 3000 })).toBe(1.4);
    });
});

describe('computeHudScales', function () {
    it('uses the configured sizes alone when auto is off', function () {
        const scales = computeHudScales({
            hud: { cards: 'large', interface: '1.5', auto: false },
            cardFit: 2,
            screen: 1.4
        });

        expect(scales).toEqual({ cards: 1.4, interface: 1.5 });
    });

    it('combines the size with the screen when auto is on', function () {
        const small = computeHudScales({
            hud: { ...defaultHud, cards: 'small', interface: 'small' },
            cardFit: 0.5,
            screen: 0.8
        });
        const desktop = computeHudScales({
            hud: { ...defaultHud, cards: 'small', interface: 'small' },
            cardFit: 1.5,
            screen: 1.2
        });

        expect(small.cards).toBeCloseTo(0.35);
        expect(desktop.cards).toBeCloseTo(1.05);
        expect(desktop.cards).toBeGreaterThan(small.cards);
        expect(desktop.interface).toBeGreaterThan(small.interface);
    });
});

describe('prompt side', function () {
    it('keeps a valid saved side and ignores an invalid one', function () {
        expect(normalizeHud({ hud: { promptSide: 'right' } }).promptSide).toBe('right');
        expect(normalizeHud({ hud: { promptSide: 'left' } }).promptSide).toBe('left');
        expect(normalizeHud({ hud: { promptSide: 'up' } }).promptSide).toBeUndefined();
    });

    it('puts the prompt on the left unless the right was chosen', function () {
        expect(promptSideOf({})).toBe('left');
        expect(promptSideOf(undefined)).toBe('left');
        expect(promptSideOf({ promptSide: 'right' })).toBe('right');
        expect(promptSideOf({ promptSide: 'up' })).toBe('left');
    });
});
