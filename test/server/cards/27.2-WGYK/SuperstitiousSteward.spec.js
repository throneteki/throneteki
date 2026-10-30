describe('Superstitious Steward', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                plotDeck: ['A Noble Cause', 'Fortified Position'],
                hand: ['Superstitious Steward'],
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                plotDeck: ['A Storm of Swords', 'A Song of Summer'],
                inPlay: ['Bastard in Hiding', 'Palace Spearman']
            }
        });

        this.player1.clickCard(this.superstitiousSteward);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
    });

    function completeChallengesPhase(context) {
        context.player1.clickPrompt('Done');
        context.player2.clickPrompt('Done');
    }

    function passUntilPlotPhase(context) {
        context.player1.clickPrompt('Pass');
        context.player1.clickPrompt('Pass');
        context.player1.clickPrompt('Pass');
    }

    it('can be triggered after each phase begins', function () {
        expect(this.player1).toAllowAbilityTrigger(this.superstitiousSteward);
        this.player1.clickPrompt('Pass');
        completeChallengesPhase(this);
        expect(this.player1).toAllowAbilityTrigger(this.superstitiousSteward);
        passUntilPlotPhase(this);
        this.player1.clickPrompt('Pass');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player2).isReadyToTakeAction();
    });

    describe('when it names a trait at the start of the plot phase', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Pass');
            completeChallengesPhase(this);
            passUntilPlotPhase(this);
            this.player1.triggerAbility(this.superstitiousSteward);
            this.player1.nameTrait('War');
        });

        describe('and an opponent reveals a plot with that trait', function () {
            beforeEach(function () {
                this.player1.selectPlot(this.aNobleCause);
                this.player2.selectPlot(this.aStormOfSwords);
                this.selectFirstPlayer(this.player1);
            });

            it('lets you sacrifice it', function () {
                expect(this.player1).toHavePrompt('Sacrifice Superstitious Steward?');
                this.player1.clickPrompt('Yes');
                this.player2.clickCard(this.palaceSpearman);
                expect(this.player1).isReadyToTakeAction();
            });

            describe('and you sacrifice it', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Yes');
                });

                it('has that player choose a character they control', function () {
                    expect(this.superstitiousSteward.location).toBe('discard pile');
                    expect(this.player2).toBeAbleToSelect(this.bastardInHiding);
                    expect(this.player2).toBeAbleToSelect(this.palaceSpearman);
                    expect(this.player2).not.toBeAbleToSelect(this.tumblestoneKnight);
                    expect(this.player1).not.toBeAbleToSelect(this.bastardInHiding);
                    this.player2.clickCard(this.palaceSpearman);
                    expect(this.player1).isReadyToTakeAction();
                });

                it('discards that character from play', function () {
                    this.player2.clickCard(this.palaceSpearman);

                    expect(this.palaceSpearman.location).toBe('discard pile');
                    expect(this.bastardInHiding.location).toBe('play area');
                    expect(this.tumblestoneKnight.location).toBe('play area');
                    expect(this.player1).isReadyToTakeAction();
                });
            });

            describe('and you decline', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('No');
                });

                it('stays in play and nothing is discarded', function () {
                    expect(this.superstitiousSteward.location).toBe('play area');
                    expect(this.palaceSpearman.location).toBe('play area');
                    expect(this.bastardInHiding.location).toBe('play area');
                    this.player1.clickPrompt('Pass');
                    this.player1.clickPrompt('Pass');
                    expect(this.player1).isReadyToTakeAction();
                });
            });
        });

        describe('and the opponent reveals a plot without that trait', function () {
            beforeEach(function () {
                this.player1.selectPlot(this.aNobleCause);
                this.player2.selectPlot(this.aSongOfSummer);
                this.selectFirstPlayer(this.player1);
            });

            it('does not let you sacrifice it', function () {
                expect(this.player1).not.toHavePrompt('Sacrifice Superstitious Steward?');
                expect(this.superstitiousSteward.location).toBe('play area');
                this.player1.clickPrompt('Pass');
                this.player1.clickPrompt('Pass');
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('and only you reveal a plot with that trait', function () {
            beforeEach(function () {
                this.player1.selectPlot(this.fortifiedPosition);
                this.player2.selectPlot(this.aSongOfSummer);
                this.selectFirstPlayer(this.player1);
            });

            it('does not let you sacrifice it', function () {
                expect(this.player1).not.toHavePrompt('Sacrifice Superstitious Steward?');
                expect(this.superstitiousSteward.location).toBe('play area');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('when it names a trait in an earlier phase', function () {
        beforeEach(function () {
            this.player1.triggerAbility(this.superstitiousSteward);
            this.player1.nameTrait('War');
            completeChallengesPhase(this);
            passUntilPlotPhase(this);
            this.player1.clickPrompt('Pass');
            this.player1.selectPlot(this.aNobleCause);
            this.player2.selectPlot(this.aStormOfSwords);
            this.selectFirstPlayer(this.player1);
        });

        it('does not let you sacrifice it when the plot is revealed in a later phase', function () {
            expect(this.player1).not.toHavePrompt('Sacrifice Superstitious Steward?');
            expect(this.superstitiousSteward.location).toBe('play area');
            this.player1.clickPrompt('Pass');
            this.player1.clickPrompt('Pass');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
