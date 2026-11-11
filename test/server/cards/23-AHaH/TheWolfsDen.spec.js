describe("The Wolf's Den (AHaH)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ["The Wolf's Den (AHaH)", 'Tumblestone Knight']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to place the bottom card of your deck in shadows after a character you control is killed', function () {
        const bottom = this.player1Object.drawDeck[this.player1Object.drawDeck.length - 1];
        this.player1.triggerAbility(this.theWolfsDen);

        expect(this.theWolfsDen.kneeled).toBe(true);
        expect(bottom.location).toBe('shadows');
        expect(bottom.tokens.shadow).toBe(1);
        expect(bottom.getShadowCost()).toBe(bottom.getPrintedCost());
        expect(this.player2).isReadyToTakeAction();
    });
});
