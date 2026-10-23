describe('Taking the Shield Islands', function () {
    function setup(location) {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Raider from Pyke (CoW)'],
                [location]: ['Taking the Shield Islands']
            },
            player2: { hand: ['Hedge Knight', 'Castle Guard'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.raiderFromPyke);
        this.player1.triggerAbility('Taking the Shield Islands');
    }

    it("places a card from the losing opponent's hand on top of their deck after you win with an attacking Raider", function () {
        setup.call(this, 'hand');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.player2Object.drawDeck[0]).toBe(this.hedgeKnight);
        expect(this.castleGuard.location).toBe('hand');
    });

    it('places up to 2 cards when played from shadows', function () {
        setup.call(this, 'shadows');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.castleGuard.location).toBe('draw deck');
    });
});
