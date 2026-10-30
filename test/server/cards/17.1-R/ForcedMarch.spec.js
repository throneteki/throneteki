describe('Forced March (R)', function () {
    function reveal(context, opponentCards) {
        context.setupTest({
            phase: 'plot',
            player1: {
                plot: 'Forced March (R)',
                inPlay: ['Hedge Knight', 'Tumblestone Knight', 'Winterfell Steward']
            },
            player2: {
                inPlay: opponentCards
            }
        });

        context.player1.selectPlot('Forced March');
        context.player2.selectPlot('Filler Plot');
        context.selectFirstPlayer(context.player1);
    }

    describe('when revealed', function () {
        beforeEach(function () {
            reveal(this, [
                'Bastard in Hiding',
                'House Dayne Knight',
                'Burned Men',
                'House Maester'
            ]);
        });

        it('kneels X characters you control with a [military] icon, then makes each opponent choose and kneel X characters they control with a [military] icon', function () {
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).not.toBeAbleToSelect(this.winterfellSteward);
            expect(this.player1).not.toBeAbleToSelect(this.bastardInHiding);

            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');

            expect(this.hedgeKnight.kneeled).toBe(true);
            expect(this.tumblestoneKnight.kneeled).toBe(true);
            expect(this.winterfellSteward.kneeled).toBe(false);
            expect(this.player2).toHavePrompt('Select 2 characters to kneel');
            expect(this.player2).not.toBeAbleToSelect(this.houseMaester);
            expect(this.player2).not.toBeAbleToSelect(this.winterfellSteward);

            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickCard(this.burnedMen);
            this.player2.clickPrompt('Done');

            expect(this.bastardInHiding.kneeled).toBe(true);
            expect(this.burnedMen.kneeled).toBe(true);
            expect(this.houseDayneKnight.kneeled).toBe(false);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Forced March to kneel Hedge Knight and Tumblestone Knight'
            );
            expect(this.game.getPlainTextLog()).toContain(
                'player2 kneels Bastard in Hiding and kneels Burned Men'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you kneel no characters', function () {
        beforeEach(function () {
            reveal(this, ['Bastard in Hiding']);

            this.player1.clickPrompt('Done');
        });

        it('does not make the opponent kneel any', function () {
            expect(this.player2).not.toHavePrompt('Select 0 characters to kneel');
            expect(this.bastardInHiding.kneeled).toBe(false);
            expect(this.game.currentPhase).toBe('marshal');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the opponent has fewer characters with a [military] icon than X', function () {
        beforeEach(function () {
            reveal(this, ['Bastard in Hiding', 'House Maester']);

            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
        });

        it('kneels as many as they are able', function () {
            expect(this.player2).toHavePrompt('Select 2 characters to kneel');

            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickPrompt('Done');

            expect(this.bastardInHiding.kneeled).toBe(true);
            expect(this.houseMaester.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
