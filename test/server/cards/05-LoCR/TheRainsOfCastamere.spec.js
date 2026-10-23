describe('The Rains of Castamere', function () {
    describe('after you win an intrigue challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'lannister',
                    agenda: '"The Rains of Castamere"',
                    inPlay: ['Cersei Lannister (LoCR)', 'House Dayne Knight', 'Burned Men'],
                    plotDeck: [
                        'Wardens of the West',
                        'The Red Wedding',
                        'A Noble Cause',
                        'A Song of Summer'
                    ],
                    gold: 2
                },
                player2: {
                    plotDeck: ['A Noble Cause'],
                    inPlay: ['Ser Jaime Lannister (Core)'],
                    hand: ['Hedge Knight', 'Winterfell Steward']
                }
            });
            this.filler = this.player1Object.activePlot;
        });

        it('does not trigger when you win by less than 5 STR', function () {
            this.unopposedChallenge(this.player1, 'Intrigue', this.houseDayneKnight);
            expect(this.player1).not.toAllowAbilityTrigger('"The Rains of Castamere"');
        });

        it('does not trigger after a challenge of another type', function () {
            this.unopposedChallenge(this.player1, 'Military', this.burnedMen);
            this.player2.clickCard(this.serJaimeLannister);
            expect(this.player1).not.toAllowAbilityTrigger('"The Rains of Castamere"');
        });

        it('does not trigger when an opponent wins', function () {
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Intrigue', this.serJaimeLannister);
            expect(this.player1).not.toAllowAbilityTrigger('"The Rains of Castamere"');
        });

        describe('by 5 or more STR', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);
                this.player1.triggerAbility('"The Rains of Castamere"');
            });

            it('kneels your faction card to reveal a Scheme plot', function () {
                expect(this.player1).not.toBeAbleToSelect(this.aNobleCause);
                this.player1.clickCard(this.wardensOfTheWest);
                expect(this.player1Object.faction.kneeled).toBe(true);
                expect(this.player1Object.activePlot).toBe(this.wardensOfTheWest);
            });

            it('lets reactions in the current window trigger on the revealed plot', function () {
                this.player1.clickCard(this.wardensOfTheWest);
                expect(this.player1).toAllowAbilityTrigger('Wardens of the West');
            });

            it('does not let interrupts on the revealed plot trigger in the reaction window', function () {
                this.player1.clickCard(this.theRedWedding);
                expect(this.player1).not.toAllowAbilityTrigger('The Red Wedding');
            });

            it('removes the revealed plot from the game when it leaves play', function () {
                this.player1.clickCard(this.wardensOfTheWest);
                this.player1.clickPrompt('Pass');
                this.player1.clickPrompt('Pass');
                this.completeChallengesPhase();
                this.player1.selectPlot(this.aNobleCause);
                this.selectFirstPlayer(this.player1);
                expect(this.wardensOfTheWest.location).toBe('out of game');
                expect(this.filler.location).toBe('revealed plots');
            });
        });
    });

    describe('with Nymeria of Ny Sar', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player2: {
                    faction: 'martell',
                    agenda: '"The Rains of Castamere"',
                    inPlay: [
                        { card: 'Dorne (R)', attachments: ['Nymeria of Ny Sar'] },
                        'The Red Viper (Core)'
                    ],
                    plotDeck: ["At Prince Doran's Behest", 'Filthy Accusations', 'The Long Plan']
                }
            });
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Power', this.theRedViper);
            this.player2.triggerAbility('Nymeria of Ny Sar');
        });

        it('does not stop Nymeria revealing a Scheme plot', function () {
            this.player2.clickCard(this.theLongPlan);
            expect(this.theLongPlan.location).toBe('active plot');
        });

        it("does not stop Nymeria revealing a Scheme plot through At Prince Doran's Behest", function () {
            this.player2.clickCard(this.atPrinceDoransBehest);
            this.player2.clickCard(this.filthyAccusations);
            expect(this.filthyAccusations.location).toBe('active plot');
        });
    });

    it('recycles plots at once when its reaction exhausts the plot deck', function () {
        this.setupTest({
            phase: 'challenge',
            player2: {
                faction: 'martell',
                agenda: '"The Rains of Castamere"',
                plot: 'A Song of Summer',
                usedPlots: ['Trading with the Pentoshi'],
                inPlay: [
                    { card: 'Dorne (R)', attachments: ['Nymeria of Ny Sar'] },
                    'The Red Viper (Core)'
                ],
                plotDeck: ["At Prince Doran's Behest", 'The Long Plan', 'Filthy Accusations']
            }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Intrigue', this.theRedViper);
        this.player2.triggerAbility('Nymeria of Ny Sar');
        this.player2.clickCard(this.atPrinceDoransBehest);
        this.player2.clickCard(this.theLongPlan);
        this.player2.triggerAbility('"The Rains of Castamere"');
        this.player2.clickCard(this.filthyAccusations);
        this.player2.clickCard(this.theRedViper);
        expect(this.player2Object.getNumberOfUsedPlots()).toBe(0);
    });
});
