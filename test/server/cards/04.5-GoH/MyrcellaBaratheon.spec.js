describe('Myrcella Baratheon (GoH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['Myrcella Baratheon (GoH)']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.myrcellaBaratheon);
        this.player2.clickPrompt('Done');
    });

    it('gains renown and does not kneel when defending in a [power] challenge while there are no Kings in play', function () {
        expect(this.myrcellaBaratheon.kneeled).toBe(false);
        expect(this.myrcellaBaratheon.hasKeyword('Renown')).toBe(true);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
