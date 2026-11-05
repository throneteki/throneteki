describe('Sansa Stark (Core)', function () {
    describe('during setup', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'setup',
                player1: {
                    hand: ['Sansa Stark (Core)']
                }
            });

            this.player1.clickCard(this.sansaStark);
            this.completeSetup();
        });

        it('is set up standing', function () {
            expect(this.sansaStark.location).toBe('play area');
            expect(this.sansaStark.kneeled).toBe(false);
            expect(this.player1).toHavePrompt('Select a plot');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Sansa Stark (Core)']
                }
            });

            this.player1.clickCard(this.sansaStark);
        });

        it('enters play knelt', function () {
            expect(this.sansaStark.location).toBe('play area');
            expect(this.sansaStark.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when she stands', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    gold: 2,
                    inPlay: [
                        { card: 'Sansa Stark (Core)', kneeling: true },
                        { card: 'Tumblestone Knight', kneeling: true },
                        'Magister Illyrio (Core)'
                    ]
                },
                player2: {
                    inPlay: ['Ranging Party']
                }
            });
        });

        it('gains 1 power for your faction', function () {
            this.player1.clickMenu(this.magisterIllyrio, 'Stand a character');
            this.player1.clickCard(this.sansaStark);
            this.player1.triggerAbility(this.sansaStark);

            expect(this.sansaStark.kneeled).toBe(false);
            expect(this.player1Object.faction.power).toBe(1);
            expect(this.player2Object.faction.power).toBe(0);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Sansa Stark to gain 1 power for their faction'
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot be triggered when another character stands', function () {
            this.player1.clickMenu(this.magisterIllyrio, 'Stand a character');
            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.player1).not.toAllowAbilityTrigger(this.sansaStark);
            expect(this.player1Object.faction.power).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can only be triggered once per round', function () {
            this.player1.clickMenu(this.magisterIllyrio, 'Stand a character');
            this.player1.clickCard(this.sansaStark);
            this.player1.triggerAbility(this.sansaStark);
            this.unopposedChallenge(this.player1, 'Intrigue', this.sansaStark);

            expect(this.sansaStark.kneeled).toBe(true);
            expect(this.player1Object.faction.power).toBe(2);

            this.completeChallengesPhase();

            expect(this.sansaStark.kneeled).toBe(false);
            expect(this.player1Object.faction.power).toBe(2);
            expect(this.game.currentPhase).toBe('plot');
            expect(this.player1).toHavePrompt('Select a plot');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
