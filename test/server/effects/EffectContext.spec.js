import Effects from '../../../server/game/effects.js';

describe('effect callbacks', function () {
    beforeEach(function () {
        this.source = { name: 'source' };
        this.context = { game: {}, source: this.source };
        this.card = { uuid: '1', controller: 'player', keywordSources: [] };
    });

    for (const [name, playingType] of [
        ['canPlay', 'play'],
        ['canMarshal', 'marshal'],
        ['canMarshalIntoShadows', 'marshalIntoShadows'],
        ['canAmbush', 'ambush']
    ]) {
        describe(name, function () {
            beforeEach(function () {
                this.player = { name: 'player1', playableLocations: [] };
                this.effect = Effects[name]((card, context) => context.source === this.source);
                this.effect.apply(this.player, this.context);
            });

            it('passes the effect context to the predicate', function () {
                const location = this.player.playableLocations[0];
                expect(location.playingType).toBe(playingType);
                expect(location.contains(this.card)).toBe(true);
            });

            it('removes the location on unapply', function () {
                this.effect.unapply(this.player, this.context);
                expect(this.player.playableLocations).toEqual([]);
            });
        });
    }

    describe('cannot effects', function () {
        it('pass the ability context and the effect context to the condition', function () {
            const restrictions = [];
            this.card.addAbilityRestriction = (restriction) => restrictions.push(restriction);
            this.card.removeAbilityRestriction = (restriction) =>
                restrictions.splice(restrictions.indexOf(restriction), 1);
            const abilityContext = { source: { name: 'event' } };
            const effect = Effects.cannotTarget(
                (targetingContext, effectContext) =>
                    targetingContext === abilityContext && effectContext.source === this.source
            );

            effect.apply(this.card, this.context);

            expect(restrictions[0].isMatch('target', abilityContext)).toBe(true);

            effect.unapply(this.card, this.context);

            expect(restrictions).toEqual([]);
        });
    });

    describe('immuneTo', function () {
        it('passes the effect context to the condition', function () {
            const restrictions = [];
            this.card.addAbilityRestriction = (restriction) => restrictions.push(restriction);
            const conditionArgs = [];
            const effect = Effects.immuneTo((...args) => {
                conditionArgs.push(args);
                return true;
            });
            effect.apply(this.card, this.context);

            const abilitySource = { name: 'ability source' };
            const abilityContext = { resolutionStage: 'effect', source: abilitySource };
            expect(restrictions[0].isMatch('target', abilityContext)).toBe(true);
            expect(conditionArgs).toEqual([[abilitySource, abilityContext, this.context]]);
        });
    });

    describe('canSelectAsFirstPlayer', function () {
        it('passes the effect context to the condition', function () {
            const player = {};
            const candidate = { name: 'candidate' };
            const effect = Effects.canSelectAsFirstPlayer(
                (selected, context) => selected === candidate && context === this.context
            );
            effect.apply(player, this.context);

            expect(player.firstPlayerSelectCondition(candidate)).toBe(true);
        });
    });

    describe('takeControl', function () {
        it('passes the effect context to the controller function', function () {
            const newController = { name: 'new controller' };
            const takeControlByEffect = vi.fn();
            this.source.controller = newController;
            this.context.game = { takeControlByEffect, addMessage: () => {} };
            const effect = Effects.takeControl((context) => context.source.controller);

            effect.apply(this.card, this.context);

            expect(takeControlByEffect).toHaveBeenCalledWith(newController, this.card, this.source);
        });
    });

    describe('dynamicKeywordSources', function () {
        beforeEach(function () {
            this.keywordSource = { name: 'keyword source' };
            this.effect = Effects.dynamicKeywordSources((card, context) =>
                context === this.context ? [this.keywordSource] : []
            );
            this.effect.apply(this.card, this.context);
        });

        it('passes the effect context to the source function', function () {
            expect(this.card.keywordSources[0](this.card)).toEqual([this.keywordSource]);
        });

        it('removes the source function on unapply', function () {
            this.effect.unapply(this.card, this.context);
            expect(this.card.keywordSources).toEqual([]);
        });
    });
});
