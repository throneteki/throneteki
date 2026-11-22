describe('Blood Magic Ritual', function () {
    describe('when a character would be killed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Bran Stark (Core)'], hand: ['Blood Magic Ritual'], gold: 5 },
                player2: { inPlay: ['Hedge Knight'] }
            });
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
            this.player1.clickCard(this.branStark);
            this.player1.triggerAbility('Blood Magic Ritual');
        });

        it('saves a non-Army character that would be killed and attaches itself to it as a Condition', function () {
            expect(this.branStark.location).toBe('play area');
            expect(this.bloodMagicRitual.parent).toBe(this.branStark);
            expect(this.bloodMagicRitual.getType()).toBe('attachment');
            expect(this.bloodMagicRitual.hasTrait('Condition')).toBe(true);
            expect(this.bloodMagicRitual.isTerminal()).toBe(true);
        });

        it("treats the attached character's printed text box as blank", function () {
            expect(this.branStark.isAnyBlank()).toBe(true);
        });
    });

    describe('when a character would be killed by burn', function () {
        function burn(context, defender) {
            context.player2.clickPrompt('Power');
            context.player2.clickCard(context.khalDrogo);
            context.player2.clickPrompt('Done');
            context.skipActionWindow();
            context.player1.clickCard(defender);
            context.player1.clickPrompt('Done');
            context.player2.clickCard(context.consumingFlames);
            context.player2.clickCard(context.dracarys);
            context.player2.clickCard(defender);
        }

        function setup(context, player1) {
            context.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: { hand: ['Blood Magic Ritual'], gold: 1, ...player1 },
                player2: {
                    faction: 'targaryen',
                    hand: ['Consuming Flames', 'Dracarys!'],
                    inPlay: ['Khal Drogo (Core)'],
                    gold: 2
                }
            });
        }

        describe('and blanking it would take it above 0 STR', function () {
            beforeEach(function () {
                setup(this, {
                    inPlay: ['Sansa Stark (WotN)'],
                    deadPile: ['Winterfell Steward']
                });
                burn(this, this.sansaStark);
            });

            it('saves it, and the blank takes it above 0 STR', function () {
                expect(this.sansaStark.getStrength()).toBe(0);
                this.player1.triggerAbility('Blood Magic Ritual');

                expect(this.sansaStark.location).toBe('play area');
                expect(this.bloodMagicRitual.parent).toBe(this.sansaStark);
                expect(this.sansaStark.getStrength()).toBe(1);
            });
        });

        describe('and blanking it would not take it above 0 STR', function () {
            beforeEach(function () {
                setup(this, { inPlay: ['Winterfell Steward'] });
                burn(this, this.winterfellSteward);
            });

            it('kills it without offering the save', function () {
                expect(this.player1).not.toAllowAbilityTrigger(this.bloodMagicRitual);
                expect(this.winterfellSteward.location).toBe('dead pile');
                expect(this.bloodMagicRitual.location).toBe('hand');
            });
        });
    });
});
