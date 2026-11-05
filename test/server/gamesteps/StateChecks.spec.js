describe('state checks', function () {
    describe('while the card is blank', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'greyjoy',
                    gold: 8,
                    hand: ['Nightmares', 'Asha Greyjoy (Core)'],
                    inPlay: ['Esgred']
                }
            });

            this.player1.clickCard(this.nightmares);
            this.player1.clickCard(this.esgred);
            this.player1.clickCard(this.ashaGreyjoy);
        });

        it('does not apply', function () {
            expect(this.esgred.location).toBe('play area');
            expect(this.ashaGreyjoy.power).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('applies as soon as the blank ends', function () {
            this.completeMarshalPhase();

            expect(this.esgred.location).toBe('discard pile');
            expect(this.ashaGreyjoy.power).toBe(1);
        });
    });

    describe('when an opponent can cancel triggered abilities', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'greyjoy',
                    gold: 7,
                    hand: ['Asha Greyjoy (Core)'],
                    inPlay: ['Esgred']
                },
                player2: {
                    inPlay: ['Harrenhal (TTWDFL)', 'House Maester']
                }
            });

            this.player1.clickCard(this.ashaGreyjoy);
        });

        it('is not a triggered ability, so it cannot be cancelled', function () {
            expect(this.player2).not.toAllowAbilityTrigger(this.harrenhal);
            expect(this.esgred.location).toBe('discard pile');
            expect(this.ashaGreyjoy.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
