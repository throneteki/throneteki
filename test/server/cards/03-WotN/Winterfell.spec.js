describe('Winterfell (WotN)', function () {
    function setup(context, { winterfellKneeling = false } = {}) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'stark',
                plot: 'Strained Reserves (MaV)',
                inPlay: [
                    { card: 'Winterfell (WotN)', kneeling: winterfellKneeling },
                    'Northern Armory',
                    'Tumblestone Knight',
                    'House Maester'
                ]
            },
            player2: {
                faction: 'stark',
                inPlay: ['Winterfell Steward', 'Old Gate']
            }
        });
    }

    describe('its constant ability', function () {
        beforeEach(function () {
            setup(this);
        });

        it('gives each [stark] character you control +1 STR', function () {
            expect(this.tumblestoneKnight.getStrength()).toBe(3);
            expect(this.houseMaester.getStrength()).toBe(2);
            expect(this.winterfellSteward.getStrength()).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a challenge is initiated', function () {
        beforeEach(function () {
            setup(this);
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
        });

        it('can be triggered', function () {
            expect(this.player1).toAllowAbilityTrigger(this.winterfell);
            expect(this.player2).not.toAllowAbilityTrigger(this.winterfell);

            this.player1.clickPrompt('Pass');

            expect(this.winterfell.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        describe('and Winterfell is triggered', function () {
            beforeEach(function () {
                this.player1.triggerAbility(this.winterfell);
            });

            it('kneels Winterfell, and stops each player with a non-Winter plot triggering card abilities', function () {
                expect(this.winterfell.kneeled).toBe(true);
                expect(this.player1.actionUnavailableReason(this.northernArmory)).toBeUndefined();

                this.player1.clickPrompt('Pass');

                expect(this.player2.actionUnavailableReason(this.oldGate)).toBe('cannotTrigger');
                expect(this.player2).isReadyToTakeAction();
            });

            it('lets players trigger card abilities again after the challenge', function () {
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();

                expect(this.game.currentChallenge).toBeFalsy();
                expect(this.player2Object.canTrigger(this.oldGate.abilities.actions[0])).toBe(true);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('while Winterfell is kneeling', function () {
        beforeEach(function () {
            setup(this, { winterfellKneeling: true });
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.winterfell);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
