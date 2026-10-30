describe('Forced March', function () {
    function setup(context, player2 = {}) {
        context.setupTest({
            phase: 'plot',
            player1: {
                faction: 'targaryen',
                plotDeck: ['Forced March (SoD)'],
                inPlay: ['Hedge Knight', 'Hedge Knight', 'Hedge Knight']
            },
            player2: { inPlay: ['Hedge Knight', 'Hedge Knight'], ...player2 }
        });
        [context.char1] = context.player1.filterCardsByName('Hedge Knight', 'play area');
        [context.opponentChar1, context.opponentChar2] = context.player2.filterCardsByName(
            'Hedge Knight',
            'play area'
        );
        context.player1.selectPlot('Forced March');
        context.player2.selectPlot(player2.plotDeck ? player2.plotDeck[0] : 'Filler Plot');
        context.selectFirstPlayer(context.player1);
        context.player2.clickCard(context.opponentChar1);
    }

    describe('when revealed', function () {
        beforeEach(function () {
            setup(this);
        });

        it('has each opponent kneel a character with a military icon', function () {
            expect(this.opponentChar1.kneeled).toBe(true);
        });

        it('lets you kneel a character with a military icon to initiate the effect again', function () {
            expect(this.player1).toHavePrompt('Select card to kneel');
            this.player1.clickCard(this.char1);
            this.player2.clickCard(this.opponentChar2);
            expect(this.char1.kneeled).toBe(true);
            expect(this.opponentChar2.kneeled).toBe(true);
        });

        it('does not offer to initiate it again when no opponent has a character to kneel', function () {
            this.player1.clickCard(this.char1);
            this.player2.clickCard(this.opponentChar2);
            expect(this.player1).toHavePrompt('Marshal your cards');
        });
    });

    it('gives another chance to cancel when initiated again', function () {
        setup(this, {
            faction: 'targaryen',
            plotDeck: ['Outwit'],
            inPlay: ['Hedge Knight', 'Hedge Knight', 'Maester Wendamyr']
        });
        this.player2.clickPrompt('Pass');
        this.player1.clickCard(this.char1);
        this.player2.clickCard(this.opponentChar2);
        expect(this.player2).toAllowAbilityTrigger('Outwit');
    });
});
