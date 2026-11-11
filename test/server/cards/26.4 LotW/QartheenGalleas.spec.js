describe('Qartheen Galleas', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                shadows: ['Qartheen Galleas'],
                discard: ['Undercity Spymaster', 'Tumblestone Knight'],
                gold: 1
            }
        });
        this.player1.clickCard(this.qartheenGalleas);
        this.player1.triggerAbility(this.qartheenGalleas);
    });

    it('returns a card with shadow from your discard pile to your hand after it comes out of shadows', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.undercitySpymaster);

        expect(this.undercitySpymaster.location).toBe('hand');
        expect(this.player1Object.getHandCount()).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
