describe('Statue of Baelor', function () {
    describe('when used', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: [
                        'Statue of Baelor',
                        { card: 'Tumblestone Knight', kneeling: true, power: 1 }
                    ]
                }
            });
            this.player1.clickMenu(this.statueOfBaelor, 'Stand card');
            this.player1.clickCard(this.tumblestoneKnight);
        });

        it('kneels and discards 1 power from another card you control to stand it', function () {
            expect(this.statueOfBaelor.kneeled).toBe(true);
            expect(this.tumblestoneKnight.power).toBe(0);
            expect(this.tumblestoneKnight.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
