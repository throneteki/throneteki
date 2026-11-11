describe('You Murdered Her Children (TTWDFL)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['You Murdered Her Children (TTWDFL)'] },
            player2: { inPlay: ['Burned Men'], hand: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.copy = this.player2.findCardByName('Burned Men', 'hand');
        this.unopposedChallenge(this.player2, 'Military', this.burnedMen);
        this.player1.triggerAbility(this.youMurderedHerChildren);
    });

    it("discards an attacking character after you lose as the defender, then discards copies of it from its controller's hand and deck", function () {
        this.player1.clickCard(this.burnedMen);
        this.player1.clickCard(this.copy);
        this.player1.clickPrompt('Done');

        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.copy.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
