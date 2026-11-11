describe("King Stannis's Host (FtR)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ["King Stannis's Host (FtR)", 'Stannis Baratheon (Core)']
            },
            player2: {
                inPlay: ['Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.kingStannissHost);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
    });

    it("gives Stannis Baratheon stealth, and each participating opponent's character -1 STR in [power] challenges", function () {
        expect(this.stannisBaratheon.hasKeyword('Stealth')).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(1);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
