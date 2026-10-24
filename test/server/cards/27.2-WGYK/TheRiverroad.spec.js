describe('The Riverroad', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'A Noble Cause',
                inPlay: ['The Riverroad', 'Tumblestone Knight']
            },
            player2: {
                faction: 'martell',
                inPlay: ['House Dayne Knight']
            }
        });
    });

    it('gives its controller +1 income', function () {
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });

    describe('when it is used', function () {
        beforeEach(function () {
            this.player1.clickMenu(this.theRiverroad, 'Give a character a challenge icon');
        });

        it('can choose any character', function () {
            expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).toBeAbleToSelect(this.houseDayneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.theRiverroad);
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Intrigue');
            expect(this.player1).isReadyToTakeAction();
        });

        describe('and a character and icon are chosen', function () {
            beforeEach(function () {
                this.player1.clickCard(this.tumblestoneKnight);
                this.player1.clickPrompt('Intrigue');
            });

            it('kneels and sacrifices The Riverroad to give the character the icon', function () {
                expect(this.theRiverroad.location).toBe('discard pile');
                expect(this.tumblestoneKnight.hasIcon('intrigue')).toBe(true);
                expect(this.houseDayneKnight.hasIcon('power')).toBe(false);
                expect(this.player1).isReadyToTakeAction();
            });

            it('removes the icon at the end of the phase', function () {
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.tumblestoneKnight.hasIcon('intrigue')).toBe(false);
                expect(this.tumblestoneKnight.hasIcon('military')).toBe(true);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
