describe("Lord Anders's Host", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: ["Lord Anders's Host (FtR)"],
                hand: ['Burned Men'],
                gold: 5
            },
            player2: { inPlay: ['Winterfell Steward', 'Castle Guard'] }
        });
        this.host = this.player1.findCardByName("Lord Anders's Host", 'play area');
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.host);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.winterfellSteward);
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.burnedMen);
        this.player1.triggerAbility("Lord Anders's Host");
    });

    it("returns a participating character with a lower printed cost than the card that entered play to its owner's hand", function () {
        expect(this.player1).not.toBeAbleToSelect(this.host);
        expect(this.player1).not.toBeAbleToSelect(this.castleGuard);
        this.player1.clickCard(this.winterfellSteward);
        expect(this.winterfellSteward.location).toBe('hand');
        expect(this.castleGuard.location).toBe('play area');
    });

    it('gives +1 initiative', function () {
        expect(this.player1Object.getInitiative()).toBe(1);
    });
});
