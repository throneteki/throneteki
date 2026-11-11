describe('Sweetsleep (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [
                    {
                        card: 'Tumblestone Knight',
                        attachments: ['Sweetsleep (HMW)', 'Little Bird (Core)']
                    }
                ]
            }
        });
    });

    it('treats each other attachment on the attached card as blank', function () {
        expect(this.littleBird.isAnyBlank()).toBe(true);
        expect(this.tumblestoneKnight.hasIcon('intrigue')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
