describe('Our Blades are Sharp', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Hedge Knight'],
                hand: ['Our Blades are Sharp'],
                discard: ['Dreadfort Maester'],
                deadPile: ['Roose Bolton (GoH)']
            }
        });
        this.player1.clickCard(this.ourBladesAreSharp);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.dreadfortMaester);
        this.player1.clickCard(this.rooseBolton);
        this.player1.clickPrompt('Done');
    });

    it('sacrifices a non-stark card to return up to 2 House Bolton cards from your discard or dead pile to hand', function () {
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.dreadfortMaester.location).toBe('hand');
        expect(this.rooseBolton.location).toBe('hand');
    });

    it('costs 1 less to play while you control Harrenhal or The Dreadfort', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Hedge Knight', 'Harrenhal (GoH)'],
                hand: ['Our Blades are Sharp'],
                discard: ['Dreadfort Maester'],
                gold: 0
            }
        });
        this.player1.clickCard(this.ourBladesAreSharp);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.dreadfortMaester);
        this.player1.clickPrompt('Done');
        expect(this.dreadfortMaester.location).toBe('hand');
    });
});
