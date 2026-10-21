describe('The Lord of the Crossing', function () {
    describe('with attackers declared normally', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    agenda: 'The Lord of the Crossing',
                    inPlay: ['Tumblestone Knight', 'House Maester', 'Bastard in Hiding']
                },
                player2: {
                    agenda: 'The Lord of the Crossing',
                    inPlay: ['Winterfell Steward']
                }
            });
        });

        describe('during the first challenge you initiate', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.tumblestoneKnight);
                this.player1.clickPrompt('Done');
            });

            it('gives each of your participating characters -1 STR', function () {
                expect(this.tumblestoneKnight.getStrength()).toBe(1);
                expect(this.game.currentChallenge.attackerStrength).toBe(1);
                expect(this.houseMaester.getStrength()).toBe(2);
                expect(this.player1).isReadyToTakeAction();
            });

            it('ends with the challenge', function () {
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickCard(this.winterfellSteward);

                expect(this.tumblestoneKnight.getStrength()).toBe(2);
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('during later challenges you initiate', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
                this.player2.clickCard(this.winterfellSteward);
            });

            it('does not modify STR during the second', function () {
                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard(this.houseMaester);
                this.player1.clickPrompt('Done');

                expect(this.houseMaester.getStrength()).toBe(2);
                expect(this.game.currentChallenge.attackerStrength).toBe(2);
                expect(this.player1).isReadyToTakeAction();
            });

            describe('during the third', function () {
                beforeEach(function () {
                    this.unopposedChallenge(this.player1, 'Intrigue', this.houseMaester);

                    this.player1.clickPrompt('Power');
                    this.player1.clickCard(this.bastardInHiding);
                    this.player1.clickPrompt('Done');
                });

                it('gives each of your participating characters +2 STR', function () {
                    expect(this.bastardInHiding.getStrength()).toBe(4);
                    expect(this.game.currentChallenge.attackerStrength).toBe(4);
                    expect(this.player1).isReadyToTakeAction();
                });

                it('gains 1 power for your faction if you win', function () {
                    const powerBefore = this.player1Object.faction.power;

                    this.skipActionWindow();
                    this.player2.clickPrompt('Done');
                    this.skipActionWindow();

                    expect(this.player1Object.faction.power).toBe(powerBefore + 2);
                    expect(this.game.getPlainTextLog()).toContain(
                        'player1 gains 1 power from The Lord of the Crossing'
                    );
                    expect(this.player1).isReadyToTakeAction();
                });
            });
        });
    });

    describe('when a character joins the first challenge after attackers are declared', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'thenightswatch',
                    agenda: 'The Lord of the Crossing',
                    inPlay: ['Jon Snow (Core)', 'Steward at the Wall']
                }
            });

            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.stewardAtTheWall);
            this.player1.clickPrompt('Done');
        });

        it('gives it -1 STR too', function () {
            expect(this.jonSnow.isParticipating()).toBe(true);
            expect(this.jonSnow.getStrength()).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
