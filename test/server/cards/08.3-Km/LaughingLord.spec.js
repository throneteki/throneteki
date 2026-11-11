describe('Laughing Lord', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'baratheon', inPlay: ['Laughing Lord', 'Bastard in Hiding'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.bastardInHiding);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.laughingLord);
        this.player1.clickCard(this.bastardInHiding);
    });

    it('kneels to give an attacking baratheon character intimidate after you initiate a challenge', function () {
        expect(this.laughingLord.kneeled).toBe(true);
        expect(this.bastardInHiding.hasKeyword('intimidate')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
