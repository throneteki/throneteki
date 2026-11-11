describe('Lady Stoneheart', function () {
    it('has each player kill a loyal or House Frey character they control when the challenges phase ends', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Lady Stoneheart', 'Robb Stark (Core)'] },
            player2: { inPlay: ['Robert Baratheon (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.robbStark);
        this.player2.clickCard(this.robertBaratheon);
        expect(this.robbStark.location).toBe('dead pile');
        expect(this.robertBaratheon.location).toBe('dead pile');
    });

    it('discards 1 power from a Brotherhood character to come into play from your dead pile during dominance', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                deadPile: ['Lady Stoneheart'],
                inPlay: [{ card: 'Edric Dayne (Core)', power: 1 }]
            }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.ladyStoneheart);
        this.player1.clickCard(this.edricDayne);
        expect(this.ladyStoneheart.location).toBe('play area');
        expect(this.edricDayne.power).toBe(0);
    });
});
