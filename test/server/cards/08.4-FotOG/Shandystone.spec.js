describe('Shandystone', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: ['Shandystone', { card: 'Tumblestone Knight', kneeling: true }]
            },
            player2: { inPlay: ['Littlefinger (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Intrigue', this.littlefinger);
        this.player1.triggerAbility(this.shandystone);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to stand a character you control after you lose a challenge as the defender', function () {
        expect(this.shandystone.kneeled).toBe(true);
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
