describe('Queensguard (SoKL)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'targaryen',
                inPlay: [
                    {
                        card: 'Tumblestone Knight',
                        kneeling: true,
                        attachments: ['Queensguard (SoKL)']
                    }
                ],
                hand: ['Burned Men']
            }
        });
        this.player1.clickCard(this.queensguard);
        this.player1.clickCard(this.burnedMen);
    });

    it('discards a card from your hand to stand the attached character', function () {
        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
