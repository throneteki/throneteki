describe('Defensive Debris', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    {
                        card: 'Tumblestone Knight',
                        attachments: [{ card: 'Defensive Debris', gold: 1 }]
                    }
                ]
            },
            player2: { discard: ['Hot Pie (FFH)'], hand: ['Burned Men'], gold: 2 }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.defensiveDebris);
        this.player1.clickCard(this.hotPie);
    });

    it("discards 1 gold to stop cards with the same printed cost as a card in an opponent's discard pile being played or put into play", function () {
        expect(this.defensiveDebris.gold).toBe(0);
        expect(this.tumblestoneKnight.getStrength()).toBe(3);
        expect(this.player2Object.canPutIntoPlay(this.burnedMen, 'ambush')).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
