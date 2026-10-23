describe('Red Priest (FotS)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: { faction: 'baratheon', hand: ['Red Priest (FotS)'] },
            player2: {
                inPlay: ['Hedge Knight'],
                hand: ['Ser Jaime Lannister (Core)', 'Burned Men']
            }
        });
        this.player1.clickCard(this.redPriest);
        this.player1.triggerAbility('Red Priest');
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.burnedMen);
    });

    it("looks at an opponent's hand and removes a card in it from the game", function () {
        expect(this.burnedMen.location).toBe('out of game');
        expect(this.serJaimeLannister.location).toBe('hand');
    });

    it('returns the card to hand when Red Priest leaves play', function () {
        this.completeMarshalPhase();
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.redPriest);
        expect(this.redPriest.location).toBe('dead pile');
        expect(this.burnedMen.location).toBe('hand');
    });
});
