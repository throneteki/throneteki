describe('The Wolf King', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'stark',
                    hand: ['The Wolf King'],
                    inPlay: ['Tumblestone Knight', 'House Maester']
                }
            });

            this.player1.clickCard(this.theWolfKing);
        });

        it('can only be attached to a [stark] character', function () {
            expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.houseMaester);
        });
    });

    describe('while attached', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'stark',
                    inPlay: [{ card: 'Tumblestone Knight', attachments: ['The Wolf King'] }]
                }
            });
        });

        it('gives the King trait', function () {
            expect(this.tumblestoneKnight.hasTrait('King')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('stops the character kneeling when declared as an attacker in a [military] challenge', function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');

            expect(this.tumblestoneKnight.isAttacking()).toBe(true);
            expect(this.tumblestoneKnight.kneeled).toBe(false);
        });

        it('still kneels it in other challenges', function () {
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');

            expect(this.tumblestoneKnight.kneeled).toBe(true);
        });
    });
});
