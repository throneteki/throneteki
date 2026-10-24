describe("Tywin's Whisperer", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ["Tywin's Whisperer"] },
            player2: { inPlay: ['Myrcella Baratheon (ATT)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Power', this.myrcellaBaratheon);
        this.player2.triggerAbility(this.myrcellaBaratheon);
        this.player1.triggerAbility(this.tywinsWhisperer);
    });

    it("puts itself into play with a power icon and stealth after a character with printed cost 2 or lower is returned to an opponent's hand", function () {
        expect(this.tywinsWhisperer.location).toBe('play area');
        expect(this.tywinsWhisperer.hasIcon('power')).toBe(true);
        expect(this.tywinsWhisperer.hasKeyword('stealth')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
