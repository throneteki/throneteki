describe('Val', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Val'], hand: ["Rattleshirt's Raiders"] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.val);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility('Val');
        this.player1.clickCard(this.rattleshirtsRaiders);
    });

    it('puts a Wildling character into play knelt, participating as an attacker', function () {
        expect(this.rattleshirtsRaiders.location).toBe('play area');
        expect(this.rattleshirtsRaiders.kneeled).toBe(true);
        expect(this.rattleshirtsRaiders.isAttacking()).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
