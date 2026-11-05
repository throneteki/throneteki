describe('Delena Florent', function () {
    it('searches your deck for a Bastard character after she enters play', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Delena Florent'],
                drawDeck: ['Tumblestone Knight', 'Bastard in Hiding']
            }
        });

        this.player1.clickCard(this.delenaFlorent);
        this.player1.triggerAbility(this.delenaFlorent);

        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.bastardInHiding);

        expect(this.bastardInHiding.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('stops non-Bastard characters standing during the challenges phase', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Delena Florent', 'Tumblestone Knight']
            }
        });

        expect(this.tumblestoneKnight.allowGameAction('stand')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
