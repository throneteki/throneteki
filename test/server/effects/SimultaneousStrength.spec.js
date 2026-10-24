import Effects from '../../../server/game/effects.js';

describe('simultaneous strength changes', function () {
    beforeEach(function () {
        this.setupTest({ player1: { inPlay: ['House Maester'] } });
    });

    for (const amounts of [
        [-3, 2],
        [2, -3]
    ]) {
        it(`applies and expires ${amounts.join(', ')} without burning an intermediate zero`, function () {
            this.game.addSimultaneousEffects([
                ...amounts.map((amount) => ({
                    source: this.houseMaester,
                    properties: {
                        duration: 'untilEndOfPhase',
                        match: this.houseMaester,
                        effect: Effects.modifyStrength(amount)
                    }
                })),
                {
                    source: this.houseMaester,
                    properties: {
                        duration: 'untilEndOfPhase',
                        match: this.houseMaester,
                        effect: Effects.burn
                    }
                }
            ]);
            this.game.continue();
            expect(this.houseMaester.getStrength()).toBe(1);
            expect(this.houseMaester.location).toBe('play area');
            this.completeMarshalPhase();
            expect(this.houseMaester.getStrength()).toBe(2);
            expect(this.houseMaester.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    }

    it('checks burn immediately when a set-strength effect expires and another burn remains', function () {
        this.game.addSimultaneousEffects([
            {
                source: this.houseMaester,
                properties: {
                    duration: 'untilEndOfPhase',
                    match: this.houseMaester,
                    effect: Effects.setStrength(5)
                }
            },
            {
                source: this.houseMaester,
                properties: {
                    duration: 'persistent',
                    match: this.houseMaester,
                    effect: Effects.killByStrength(-3)
                }
            }
        ]);
        this.game.continue();
        expect(this.houseMaester.getStrength()).toBe(5);
        this.completeMarshalPhase();
        expect(this.houseMaester.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('keeps a persistent burn when a different burn expires at the same time as set strength', function () {
        this.game.addSimultaneousEffects([
            {
                source: this.houseMaester,
                properties: {
                    duration: 'untilEndOfPhase',
                    match: this.houseMaester,
                    effect: [Effects.setStrength(5), Effects.burn]
                }
            },
            {
                source: this.houseMaester,
                properties: {
                    duration: 'persistent',
                    match: this.houseMaester,
                    effect: Effects.killByStrength(-3)
                }
            }
        ]);
        this.game.continue();
        this.completeMarshalPhase();
        expect(this.houseMaester.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('simultaneous dynamic strength recalculation', function () {
    it('does not offer a stand reaction for offsetting changes whose net effect is zero', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Randyll Tarly (Core)', kneeling: true }, 'House Maester']
            }
        });
        let modifier = 0;
        this.game.addSimultaneousEffects(
            [(modifier) => modifier, (modifier) => -modifier].map((value) => ({
                source: this.houseMaester,
                properties: {
                    duration: 'persistent',
                    match: this.randyllTarly,
                    effect: Effects.dynamicStrength(() => value(modifier))
                }
            }))
        );
        this.game.continue();
        modifier = 1;
        this.game.refreshGameState();
        this.game.continue();
        expect(this.randyllTarly.getStrength()).toBe(5);
        expect(this.randyllTarly.kneeled).toBe(true);
        expect(this.player1).not.toAllowAbilityTrigger(this.randyllTarly);
        expect(this.player1).isReadyToTakeAction();
    });
});
