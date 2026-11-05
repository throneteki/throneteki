describe('Favor of the Old Gods', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    {
                        card: 'Tumblestone Knight',
                        kneeling: true,
                        attachments: ['Favor of the Old Gods']
                    }
                ]
            }
        });
    });

    it('gives the attached character the Old Gods trait', function () {
        expect(this.tumblestoneKnight.hasTrait('Old Gods')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('kneels to stand the attached character while everything you control is [stark]', function () {
        this.player1.clickCard(this.favorOfTheOldGods);

        expect(this.favorOfTheOldGods.kneeled).toBe(true);
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
