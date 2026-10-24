describe("Drogo's Arakh", function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ["Drogo's Arakh"],
                    inPlay: ['Khal Drogo (Core)', 'Tumblestone Knight']
                }
            });

            this.player1.clickCard(this.drogosArakh);
        });

        it('can only be attached to a Dothraki character, which gets +2 STR', function () {
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

            this.player1.clickCard(this.khalDrogo);

            expect(this.khalDrogo.getStrength()).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when Khal Drogo attacks in the first [military] challenge you initiate each round', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [{ card: 'Khal Drogo (Core)', attachments: ["Drogo's Arakh"] }]
                }
            });

            this.unopposedChallenge(this.player1, 'Military', this.khalDrogo);
        });

        it('does not kneel', function () {
            expect(this.khalDrogo.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
