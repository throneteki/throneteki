describe('Paxter Redwyne (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Paxter Redwyne (Core)'],
                hand: ['Nightmares']
            },
            player2: {
                inPlay: ['House Maester']
            }
        });
    });

    it('gives +1 income', function () {
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });

    it('reduces the cost of the first event you play each round by 1', function () {
        this.player1.clickCard(this.nightmares);
        this.player1.clickCard(this.houseMaester);

        expect(this.nightmares.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
