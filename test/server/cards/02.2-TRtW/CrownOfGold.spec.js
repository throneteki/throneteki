describe('Crown of Gold (TRtW)', function () {
    describe('on a character with more than 4 STR', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    inPlay: [
                        {
                            card: 'Ser Jaime Lannister (Core)',
                            attachments: ['Crown of Gold (TRtW)']
                        }
                    ]
                }
            });
        });

        it('gives the attached character the King trait and -4 STR', function () {
            expect(this.serJaimeLannister.hasTrait('King')).toBe(true);
            expect(this.serJaimeLannister.getStrength()).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('on a character with 4 STR or less', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Crown of Gold (TRtW)']
                },
                player2: {
                    inPlay: ['Bastard in Hiding']
                }
            });

            this.player1.clickCard(this.crownOfGold);
            this.player1.clickCard(this.bastardInHiding);
        });

        it('kills the attached character', function () {
            expect(this.bastardInHiding.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
