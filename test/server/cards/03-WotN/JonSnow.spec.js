describe('Jon Snow (WotN)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    'Jon Snow (WotN)',
                    'Tumblestone Knight',
                    { card: 'Arya Stark (Core)', kneeling: true }
                ]
            }
        });
        this.player1.clickCard(this.jonSnow);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.aryaStark);
    });

    it('sacrifices a stark character to stand a unique stark character', function () {
        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.aryaStark.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
