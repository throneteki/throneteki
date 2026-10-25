import Effects from '../../../server/game/effects.js';

describe('effect callbacks', function () {
    beforeEach(function () {
        this.source = { name: 'source' };
        this.context = { game: {}, source: this.source };
        this.card = { uuid: '1', controller: 'player', keywordSources: [] };
    });

    it('passes the effect context to cost reducer predicates', function () {
        const player = { addCostReducer: vi.fn() };
        const match = vi.fn((_card, context) => context.source === this.source);
        const effect = Effects.reduceCost({ playingTypes: 'marshal', match, amount: 1 });
        effect.apply(player, this.context);
        const reducer = player.addCostReducer.mock.calls[0][0];
        expect(reducer.canReduce('marshal', this.card)).toBe(true);
        expect(match).toHaveBeenCalledWith(this.card, this.context);
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
            this.context.effect = {};
            const effect = Effects.takeControl((context) => context.source.controller);

            effect.apply(this.card, this.context);

            expect(takeControlByEffect).toHaveBeenCalledWith(
                newController,
                this.card,
                this.source,
                this.context.effect
            );
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

describe('additional challenge effect context', function () {
    function player() {
        return {
            allowances: [],
            addAllowedChallenge(allowance) {
                this.allowances.push(allowance);
            },
            removeAllowedChallenge(allowance) {
                this.allowances = this.allowances.filter((entry) => entry !== allowance);
            }
        };
    }

    it('passes the current effect source to the opponent predicate', function () {
        const bearer = player();
        const opponent = {};
        const context = { source: { controller: bearer } };
        const effect = Effects.mayInitiateAdditionalChallenge(
            'power',
            (candidate, effectContext) =>
                candidate === opponent && effectContext.source.controller === bearer
        );
        effect.apply(bearer, context);
        expect(bearer.allowances[0].isMatch('power', opponent)).toBe(true);
        context.source.controller = {};
        expect(bearer.allowances[0].isMatch('power', opponent)).toBe(false);
    });

    it('preserves usage when the same effect is removed and reapplied', function () {
        const bearer = player();
        const context = {};
        const effect = Effects.mayInitiateAdditionalChallenge('power');
        effect.apply(bearer, context);
        const allowance = bearer.allowances[0];
        allowance.markUsed({});
        effect.unapply(bearer, context);
        expect(bearer.allowances).toEqual([]);
        effect.apply(bearer, context);
        expect(bearer.allowances).toEqual([allowance]);
        expect(allowance.isMatch('power', {})).toBe(false);
    });

    it('keeps usage independent for different players affected by the same effect', function () {
        const first = player();
        const second = player();
        const context = {};
        const effect = Effects.mayInitiateAdditionalChallenge('power');
        effect.apply(first, context);
        effect.apply(second, context);
        first.allowances[0].markUsed({});
        expect(first.allowances[0].isMatch('power', {})).toBe(false);
        expect(second.allowances[0].isMatch('power', {})).toBe(true);
        effect.unapply(first, context);
        expect(first.allowances).toEqual([]);
        expect(second.allowances).toHaveLength(1);
    });
});
