describe('Ser Gerris Drinkwater', function () {
    describe('when there is a card in your used pile', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'martell',
                    plot: 'A Noble Cause',
                    plotDeck: ['Taxation', 'Sneak Attack'],
                    shadows: ['Ser Gerris Drinkwater']
                },
                player2: {
                    plot: 'A Song of Summer',
                    plotDeck: ['Jousting Contest', 'A Feast for Crows']
                }
            });

            this.completeChallengesPhase();
            this.player1.selectPlot(this.taxation);
            this.player2.selectPlot(this.joustingContest);
            this.selectFirstPlayer(this.player1);

            this.player1.clickCard(this.serGerrisDrinkwater);
        });

        it('can be triggered after it comes out of shadows', function () {
            expect(this.serGerrisDrinkwater.location).toBe('play area');
            expect(this.player1).toAllowAbilityTrigger(this.serGerrisDrinkwater);
        });

        describe('and it is triggered', function () {
            beforeEach(function () {
                this.player1.triggerAbility(this.serGerrisDrinkwater);
            });

            it('can only choose a card in your plot deck', function () {
                expect(this.player1).toBeAbleToSelect(this.sneakAttack);
                expect(this.player1).not.toBeAbleToSelect(this.taxation);
                expect(this.player1).not.toBeAbleToSelect(this.aNobleCause);
                expect(this.player1).not.toBeAbleToSelect(this.aFeastForCrows);
                expect(this.player1).not.toBeAbleToSelect(this.aSongOfSummer);
                expect(this.player1).not.toBeAbleToSelect(this.joustingContest);
            });

            describe('and a card in your plot deck is chosen', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.sneakAttack);
                });

                it('can only select a card in your used pile', function () {
                    expect(this.player1).toBeAbleToSelect(this.aNobleCause);
                    expect(this.player1).not.toBeAbleToSelect(this.sneakAttack);
                    expect(this.player1).not.toBeAbleToSelect(this.taxation);
                    expect(this.player1).not.toBeAbleToSelect(this.aFeastForCrows);
                    expect(this.player1).not.toBeAbleToSelect(this.aSongOfSummer);
                    expect(this.player1).not.toBeAbleToSelect(this.joustingContest);
                });

                it('switches the two cards', function () {
                    this.player1.clickCard(this.aNobleCause);

                    expect(this.sneakAttack.location).toBe('revealed plots');
                    expect(this.aNobleCause.location).toBe('plot deck');
                    expect(this.taxation.location).toBe('active plot');
                    expect(this.aSongOfSummer.location).toBe('revealed plots');
                    expect(this.aFeastForCrows.location).toBe('plot deck');
                    expect(this.joustingContest.location).toBe('active plot');
                    expect(this.player1).isReadyToTakeAction();
                });
            });
        });
    });

    describe('when your used pile is empty', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    faction: 'martell',
                    plot: 'Taxation',
                    gold: 5,
                    shadows: ['Ser Gerris Drinkwater']
                },
                player2: {
                    plot: 'A Song of Summer',
                    plotDeck: ['Jousting Contest', 'A Feast for Crows']
                }
            });

            this.player1.clickCard(this.serGerrisDrinkwater);
        });

        it('cannot be triggered', function () {
            expect(this.serGerrisDrinkwater.location).toBe('play area');
            expect(this.player1).not.toAllowAbilityTrigger(this.serGerrisDrinkwater);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
