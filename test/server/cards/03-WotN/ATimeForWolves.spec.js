describe('A Time For Wolves', function () {
    function setup(context, direwolf) {
        context.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['A Time For Wolves'],
                drawDeck: [direwolf, 'Tumblestone Knight']
            }
        });

        context.player1.selectPlot('A Time For Wolves');
        context.player2.selectPlot('Filler Plot');
        context.selectFirstPlayer(context.player1);
    }

    it('lets you put a Direwolf card with printed cost 3 or lower into play', function () {
        setup(this, 'Summer (Core)');

        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.summer);
        this.player1.clickPrompt('Put in play');

        expect(this.summer.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('adds a more expensive Direwolf card to your hand', function () {
        setup(this, 'Grey Wind (Core)');

        this.player1.clickCard(this.greyWind);

        expect(this.greyWind.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
