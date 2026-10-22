describe("Alchemists' Guildhall", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', inPlay: ["Alchemists' Guildhall"] },
            player2: {
                inPlay: ['Magister Illyrio (Core)', { card: 'Tumblestone Knight', kneeling: true }],
                gold: 2
            }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.magisterIllyrio);
        this.player2.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.alchemistsGuildhall);
    });

    it('kneels and returns itself to shadows to cancel the effects of a triggered ability of a character without shadow', function () {
        expect(this.alchemistsGuildhall.location).toBe('shadows');
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
