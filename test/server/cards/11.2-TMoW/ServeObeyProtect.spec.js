describe('Serve. Obey. Protect.', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: ['Obara Sand (Core)'],
                hand: ['Serve. Obey. Protect.', 'Tyene Sand (SoD)']
            },
            player2: { inPlay: ['Khal Drogo (Core)', 'Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Power', this.khalDrogo);
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility(this.serveObeyProtect);
        this.player1.clickCard(this.obaraSand);
        this.player1.clickCard(this.tyeneSand);
    });

    it('returns a martell character to your hand to put a different martell character into play after an opponent initiates a challenge against you, once you have lost a challenge as the defender this phase', function () {
        expect(this.obaraSand.location).toBe('hand');
        expect(this.tyeneSand.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
