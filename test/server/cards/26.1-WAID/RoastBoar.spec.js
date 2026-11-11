describe('Roast Boar', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Roast Boar'] },
            player2: { inPlay: [{ card: 'Tumblestone Knight', kneeling: true }] }
        });
        this.player1.clickCard(this.roastBoar);
        this.player1.clickCard(this.tumblestoneKnight);
        this.completeMarshalPhase();
        this.completeChallengesPhase();
    });

    it("lets the attached character's controller choose to stand it, and is sacrificed to draw 3 cards after it stands", function () {
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility(this.roastBoar);

        expect(this.roastBoar.location).toBe('discard pile');
        expect(this.player1Object.hand).toHaveLength(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
