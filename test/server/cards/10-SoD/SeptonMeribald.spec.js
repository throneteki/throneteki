describe('Septon Meribald', function () {
    describe('when used', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: [
                        'Septon Meribald',
                        { card: 'Steward at the Wall', kneeling: true },
                        { card: 'Tumblestone Knight', kneeling: true }
                    ]
                }
            });
            this.player1.clickMenu(this.septonMeribald, 'Stand up to 3 characters');
        });

        it('kneels to stand up to 3 characters with printed STR 1 or lower', function () {
            expect(this.player1).toBeAbleToSelect(this.stewardAtTheWall);
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);
            this.player1.clickCard(this.stewardAtTheWall);
            this.player1.clickPrompt('Done');
            expect(this.stewardAtTheWall.kneeled).toBe(false);
            expect(this.septonMeribald.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
