describe('The Bloodroyal', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['The Bloodroyal'],
                    inPlay: ['House Dayne Knight', 'Tumblestone Knight']
                }
            });

            this.player1.clickCard(this.theBloodroyal);
        });

        it('can only be attached to a [martell] character', function () {
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

            this.player1.clickCard(this.houseDayneKnight);

            expect(this.theBloodroyal.parent).toBe(this.houseDayneKnight);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while you are not the first player', function () {
        beforeEach(function () {
            this.setupTest({
                player2: {
                    inPlay: [{ card: 'House Dayne Knight', attachments: ['The Bloodroyal'] }]
                }
            });
        });

        it('gives the attached character stealth and renown', function () {
            expect(this.houseDayneKnight.hasKeyword('Stealth')).toBe(true);
            expect(this.houseDayneKnight.hasKeyword('Renown')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
