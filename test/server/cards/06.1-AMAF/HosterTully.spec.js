describe('Hoster Tully', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Hoster Tully', 'Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.hosterTully);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
    });

    it('gives each other participating House Tully character you control renown while he participates', function () {
        expect(this.tumblestoneKnight.hasKeyword('Renown')).toBe(true);
        expect(this.hosterTully.hasKeyword('Renown')).toBe(false);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
