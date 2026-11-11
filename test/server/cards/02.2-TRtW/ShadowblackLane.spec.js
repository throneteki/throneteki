describe('Shadowblack Lane', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Shadowblack Lane', 'House Maester'],
                drawDeck: ['Nightmares', 'Winter Is Coming']
            }
        });

        this.unopposedChallenge(this.player1, 'Intrigue', this.houseMaester);
        this.player1.triggerAbility(this.shadowblackLane);
    });

    it('kneels your faction card to search the top 10 cards of your deck for an in-faction event after you win an [intrigue] challenge', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1).not.toBeAbleToSelect(this.nightmares);

        this.player1.clickCard(this.winterIsComing);

        expect(this.winterIsComing.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
