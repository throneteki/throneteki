describe('First in Battle', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Rose Garden',
                    'Jousting Pavilion',
                    'Fields of the Reach',
                    "King's Hunting Party"
                ],
                hand: ['First in Battle']
            }
        });
        this.player1.clickCard(this.firstInBattle);
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.kingsHuntingParty);
        this.player1.clickPrompt('Done');
    });

    it('stops each Army or House Tarly character you control kneeling when it attacks in your first challenge this phase', function () {
        expect(this.kingsHuntingParty.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
