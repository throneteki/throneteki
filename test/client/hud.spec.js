import {
    computeHudScales,
    computeScreenScale,
    defaultHud,
    isHudSize,
    normalizeHud,
    resolveHudSize,
    overlaySettingsOf
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
            animations: true
        });
    });

    it('keeps valid saved values and ignores invalid ones', function () {
        expect(normalizeHud({ hud: { cards: 'large', interface: 'bogus', auto: false } })).toEqual({
            cards: 'large',
            interface: 'normal',
            auto: false,
            animations: true
        });
        expect(normalizeHud({ hud: { animations: false } }).animations).toBe(false);
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
        expect(computeScreenScale({ width: 1600, height: 950 })).toBe(0.9);
        expect(computeScreenScale({ width: 2560, height: 1440 })).toBe(1.1);
        expect(computeScreenScale({ width: 5000, height: 3000 })).toBe(1.15);
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

describe('overlays', function () {
    it('are on, closing after 3 seconds, until changed', function () {
        expect(overlaySettingsOf({})).toEqual({ enabled: true, seconds: 3 });
        expect(overlaySettingsOf(undefined)).toEqual({ enabled: true, seconds: 3 });
        expect(normalizeHud({ hud: {} }).overlays).toBeUndefined();
    });

    it('keeps them turned off', function () {
        const hud = normalizeHud({ hud: { overlays: false } });
        expect(hud.overlays).toBe(false);
        expect(overlaySettingsOf(hud)).toEqual({ enabled: false, seconds: 3 });
    });
});
