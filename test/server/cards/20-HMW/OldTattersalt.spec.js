describe('Old Tattersalt (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Old Tattersalt (HMW)'],
                inPlay: ['Blackbird'],
                drawDeck: ['Tumblestone Knight', 'Little Bird (Core)']
            }
        });

        this.player1.clickCard(this.oldTattersalt);
        this.player1.clickPrompt('Marshal');
        this.player1.triggerAbility(this.oldTattersalt);
    });

    it('searches the top X cards for a card with printed cost 1 or lower after he enters play, and kneels Blackbird to return to shadows', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.littleBird);

        expect(this.littleBird.location).toBe('hand');

        this.player1.clickCard(this.oldTattersalt);
        this.player1.clickCard(this.blackbird);

        expect(this.blackbird.kneeled).toBe(true);
        expect(this.oldTattersalt.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
