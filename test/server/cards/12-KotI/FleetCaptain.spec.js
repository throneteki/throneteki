describe('Fleet Captain', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [
                    { card: 'Tumblestone Knight', attachments: ['Fleet Captain'] },
                    'Refurbished Hulk'
                ]
            }
        });
    });

    it('gives the attached character the Captain trait and +1 STR', function () {
        expect(this.tumblestoneKnight.hasTrait('Captain')).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
