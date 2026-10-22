describe('Selyse Baratheon (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Selyse Baratheon (Core)'] },
            player2: { inPlay: ['Nymeria Sand (TRtW)'] }
        });
        this.player2.clickMenu(this.nymeriaSand, 'Remove and gain icon');
        this.player2.clickCard(this.selyseBaratheon);
        this.player2.clickPrompt('Intrigue');
        this.player2.clickPrompt('Done');
        this.gold = this.player1Object.gold;
    });

    it('pays 1 gold to give a baratheon character an intrigue icon, restoring a stolen one', function () {
        expect(this.selyseBaratheon.hasIcon('intrigue')).toBe(false);

        this.player1.clickMenu(
            this.selyseBaratheon,
            'Pay 1 gold to give an intrigue icon to a character'
        );
        this.player1.clickCard(this.selyseBaratheon);

        expect(this.selyseBaratheon.hasIcon('intrigue')).toBe(true);
        expect(this.player1Object.gold).toBe(this.gold - 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
