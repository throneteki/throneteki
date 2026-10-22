describe('Maester at the Rock', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Maester at the Rock'],
                hand: ['Hear Me Roar!', 'Lannisport Merchant']
            }
        });
        this.player1.clickCard(this.hearMeRoar);
        this.player1.clickCard(this.lannisportMerchant);
        this.player1.triggerAbility('Maester at the Rock');
    });

    it('kneels to move the played lannister event to the top of your deck', function () {
        expect(this.maesterAtTheRock.kneeled).toBe(true);
        expect(this.player1Object.drawDeck[0]).toBe(this.hearMeRoar);
        expect(this.player1).isReadyToTakeAction();
    });
});
