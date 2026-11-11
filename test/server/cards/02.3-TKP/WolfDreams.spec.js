describe('Wolf Dreams (TKP)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Wolf Dreams (TKP)'],
                drawDeck: ['Summer (Core)', 'Tumblestone Knight']
            }
        });

        this.player1.clickCard(this.wolfDreams);
    });

    it('kneels your faction card to search your deck for a Direwolf card and add it to your hand', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.summer);

        expect(this.summer.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
