describe('The Iron Fleet', function () {
    it('reduces the cost of each Raider character you marshal by 1', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['The Iron Fleet'], hand: ['Raider from Pyke (CoW)'], gold: 5 }
        });
        this.player1.clickCard(this.raiderFromPyke);
        expect(this.player1Object.gold).toBe(4);
    });

    it("discards the top card of each opponent's deck after you initiate a challenge with an attacking Raider", function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Iron Fleet'] },
            player2: { drawDeck: ['Castle Guard', 'Winterfell Steward'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.theIronFleet);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility('The Iron Fleet');
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('draw deck');
    });
});
