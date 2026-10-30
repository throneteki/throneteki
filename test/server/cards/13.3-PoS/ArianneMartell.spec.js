describe('Arianne Martell (PoS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'martell',
                inPlay: ['Arianne Martell (PoS)'],
                shadows: ['Undercity Spymaster'],
                gold: 3
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.undercitySpymaster);
        this.player1.triggerAbility(this.arianneMartell);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Military');
    });

    it('makes a character lose a challenge icon of your choice after a card comes out of shadows under your control', function () {
        expect(this.tumblestoneKnight.hasIcon('military')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
