describe("Lysa's Letter", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Maester Luwin'] },
            player2: { hand: ["Lysa's Letter", 'Burning on the Sand'] }
        });
        this.completeMarshalPhase();
        this.player2.clickCard(this.lysasLetter);
        this.player2.clickPrompt(this.player1.name);
        this.player2.clickPrompt('Power');
    });

    it("sets the chosen player's claim to 0", function () {
        expect(this.player1Object.getClaim()).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('restores the claim after that player initiates a challenge of the chosen type', function () {
        this.unopposedChallenge(this.player1, 'Power', this.maesterLuwin);
        this.player2.clickPrompt('Pass');

        expect(this.player1Object.getClaim()).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('keeps the claim at 0 if another set claim effect is applied before that challenge', function () {
        this.unopposedChallenge(this.player1, 'Intrigue', this.maesterLuwin);
        this.player2.clickCard(this.burningOnTheSand);

        expect(this.player1Object.getClaim()).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
