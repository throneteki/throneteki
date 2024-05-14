import Effects from '../../../server/game/effects.js';
import PlayableLocation from '../../../server/game/playablelocation.js';

describe('Effects.canMarshal', function () {
    beforeEach(function () {
        this.context = {};

        this.player = { playableLocations: [] };
        this.playerHand = new PlayableLocation(
            'marshal',
            (card) => card.controller === this.player && card.location === 'hand'
        );
        this.player.playableLocations.push(this.playerHand);

        this.opponent = { opponent: 1 };

        this.effect = Effects.canMarshal(
            (card) => card.controller === this.opponent && card.location === 'discard pile'
        );
    });

    describe('apply()', function () {
        beforeEach(function () {
            this.effect.apply(this.player, this.context);
        });

        it('should add a marshal location', function () {
            let marshalLocation =
                this.player.playableLocations[this.player.playableLocations.length - 1];
            expect(marshalLocation.playingType).toBe('marshal');
            expect(
                marshalLocation.contains({ controller: this.player, location: 'discard pile' })
            ).toBe(false);
            expect(marshalLocation.contains({ controller: this.opponent, location: 'hand' })).toBe(
                false
            );
            expect(
                marshalLocation.contains({ controller: this.opponent, location: 'discard pile' })
            ).toBe(true);
        });
    });

    describe('unapply()', function () {
        beforeEach(function () {
            this.effect.apply(this.player, this.context);
            this.effect.unapply(this.player, this.context);
        });

        it('should remove the added marshal location', function () {
            expect(this.player.playableLocations).toEqual([this.playerHand]);
        });
    });
});
