import {
    landingImpact,
    liftFrames,
    sizeAt,
    restingAngle,
    seededAngle,
    slapConfig,
    slapFrames,
    slapsInto
} from '../../client/tableFeel.js';

describe('seededAngle', function () {
    it('gives the same card the same angle every time', function () {
        expect(seededAngle('card-1', 2)).toBe(seededAngle('card-1', 2));
    });

    it('stays within the limit and differs between cards', function () {
        const angles = Array.from({ length: 50 }, (_, index) => seededAngle(`card-${index}`, 2));

        expect(angles.every((angle) => Math.abs(angle) <= 2)).toBe(true);
        expect(new Set(angles).size).toBeGreaterThan(10);
    });
});

describe('restingAngle', function () {
    it('leaves cards straight except in piles that are loosely stacked', function () {
        expect(restingAngle('card-1', 'hand')).toBe(0);
        expect(restingAngle('card-1', 'play area')).toBe(0);
        expect(Math.abs(restingAngle('card-1', 'discard pile'))).toBeLessThanOrEqual(1.5);
        expect(restingAngle('card-1', 'dead pile')).toBe(restingAngle('card-1', 'dead pile'));
    });
});

describe('liftFrames', function () {
    it('lifts the card, dips as it lands, then rests', function () {
        const { card, lift } = liftFrames({ uuid: 'card-1', toSource: 'hand' });

        expect(card[0].scale).toBe(1);
        expect(Math.max(...card.map((frame) => frame.scale))).toBeGreaterThan(1);
        expect(Math.min(...card.map((frame) => frame.scale))).toBeLessThan(1);
        expect(card[card.length - 1]).toMatchObject({ scale: 1, offset: 1 });
        expect(Math.max(...lift.map((frame) => frame.opacity))).toBe(1);
        expect(lift[lift.length - 1].opacity).toBe(0);
    });

    it('comes to rest at the angle of the pile it lands in', function () {
        const { card } = liftFrames({ uuid: 'card-1', toSource: 'discard pile' });

        expect(card[card.length - 1].rotate).toBe(`${restingAngle('card-1', 'discard pile')}deg`);
    });

    it('lands harder in play than on a pile', function () {
        expect(landingImpact('play area')).toBeLessThan(landingImpact('discard pile'));
    });
});

describe('slapsInto', function () {
    it('slaps cards onto the table but not into spreads of cards', function () {
        expect(slapsInto('play area')).toBe(true);
        expect(slapsInto('discard pile')).toBe(true);
        expect(slapsInto('dead pile')).toBe(true);
        expect(slapsInto('hand')).toBe(false);
        expect(slapsInto('shadows')).toBe(false);
        expect(slapsInto(undefined)).toBe(false);
    });
});

describe('slapFrames', function () {
    const { card, lift, total } = slapFrames({ uuid: 'card-1', toSource: 'play area' });

    it('is lifted and tilted on the way, and at its true size at the impact', function () {
        const impact = card.find((frame) => frame.offset === slapConfig.move / total);
        const inFlight = card.filter((frame) => frame.offset > 0 && frame.offset < impact.offset);

        expect(card[0].scale).toBe(1);
        expect(inFlight.some((frame) => frame.scale > 1)).toBe(true);
        expect(inFlight.some((frame) => Math.abs(parseFloat(frame.rotate)) >= 1.5)).toBe(true);
        expect(impact.scale).toBe(1);
    });

    it('bounces by growing and shrinking back, never smaller than the table and without moving', function () {
        const tilts = card.map((frame) => Math.abs(parseFloat(frame.rotate)));

        expect(Math.min(...card.map((frame) => frame.scale))).toBe(1);
        expect(card.slice(1).some((frame) => frame.scale > 1)).toBe(true);
        expect(card.every((frame) => frame.translate === undefined)).toBe(true);
        expect(tilts[tilts.length - 2]).toBeLessThan(tilts[2]);
        expect(card[card.length - 1]).toMatchObject({ scale: 1, offset: 1 });
    });

    it('drops the lifted shadow at the impact', function () {
        const impact = lift.findIndex((frame) => frame.offset === slapConfig.move / total);

        expect(lift[impact].opacity).toBe(1);
        expect(lift[impact + 1].opacity).toBe(0);
        expect(lift[lift.length - 1].opacity).toBe(0);
    });
});

describe('elevation', function () {
    it('draws every zone on the table at the same size and a carried card larger', function () {
        expect(sizeAt('play area')).toBe(1);
        expect(sizeAt('hand')).toBe(1);
        expect(sizeAt('carried')).toBeGreaterThan(1);
    });

    for (const frames of [liftFrames, slapFrames]) {
        it(`${frames.name} picks a card up off the table to the carried size and puts it down`, function () {
            const { card, lift } = frames({ uuid: 'a', fromSource: 'hand', toSource: 'play area' });

            expect(card[0].scale).toBe(1);
            expect(lift[0].opacity).toBe(0);
            expect(Math.max(...card.map((frame) => frame.scale))).toBe(sizeAt('carried'));
            expect(card.at(-1).scale).toBe(1);
        });

        it(`${frames.name} starts a dropped card at the size it was carried at`, function () {
            const { card, lift } = frames({ uuid: 'a', fromSource: 'carried', toSource: 'hand' });

            expect(card[0].scale).toBe(sizeAt('carried'));
            expect(lift[0].opacity).toBe(1);
        });
    }
});
