describe('Tower of the Hand (BtRK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'The Winds of Winter',
                inPlay: [
                    'Tower of the Hand (BtRK)',
                    { card: 'Tumblestone Knight', kneeling: true }
                ],
                shadows: ['Undercity Spymaster'],
                gold: 3
            }
        });
        this.player1.clickCard(this.undercitySpymaster);
        this.player1.triggerAbility(this.towerOfTheHand);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('stands a stark character after a card you control comes out of shadows while there is a Winter plot revealed', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
