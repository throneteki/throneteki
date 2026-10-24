describe('Red Keep Gaoler', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: ['Bastard in Hiding'],
                shadows: ['Red Keep Gaoler'],
                power: 2,
                gold: 0
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.bastardInHiding);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.redKeepGaoler);
        this.player1.clickCard(this.bastardInHiding);
    });

    it('moves 2 power from your faction card to a baratheon character to put itself into play from shadows', function () {
        expect(this.bastardInHiding.power).toBe(2);
        expect(this.redKeepGaoler.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
