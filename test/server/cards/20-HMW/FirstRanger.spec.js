describe('First Ranger', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Eddard Stark (Core)', attachments: ['First Ranger'] }] },
            player2: { inPlay: ['Lannisport Merchant', 'Steward at the Wall'] }
        });
        expect(this.eddardStark.hasTrait('Ranger')).toBe(true);
        expect(this.eddardStark.hasIcon('military')).toBe(true);
        this.unopposedChallenge(this.player1, 'Military', this.eddardStark);
        this.player1.triggerAbility(this.firstRanger);
        this.player1.clickCard(this.stewardAtTheWall);
        this.player2.clickCard(this.lannisportMerchant);
    });

    it('gives the attached character a military icon and the Ranger trait, and kills a non-unique character with STR up to the number of Rangers you control after you win a military challenge', function () {
        expect(this.stewardAtTheWall.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
