describe('Jon Connington', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Jon Connington', 'Undercity Spymaster'], gold: 5 }
        });
        this.player1.clickCard(this.jonConnington);
        this.player1.triggerAbility(this.jonConnington);
    });

    it('reveals a card you control in shadows after he comes out of shadows, putting it into play if it is a non-event with printed cost 4 or lower', function () {
        this.player1.clickCard(this.undercitySpymaster);

        expect(this.undercitySpymaster.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
