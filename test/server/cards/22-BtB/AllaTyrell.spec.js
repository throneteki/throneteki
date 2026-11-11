describe('Alla Tyrell', function () {
    describe('when she is revealed from your deck', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Oldtown (JtO)'],
                    drawDeck: ['Alla Tyrell (BtB)']
                }
            });

            this.player1.clickMenu(this.oldtown, 'Reveal top card of deck');
            this.player1.clickPrompt('Character');
        });

        it('puts her into play', function () {
            this.player1.triggerAbility(this.allaTyrell);

            expect(this.allaTyrell.location).toBe('play area');
            expect(this.oldtown.kneeled).toBe(true);
            expect(this.player1Object.faction.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can be declined, and she is drawn instead', function () {
            this.player1.clickPrompt('Pass');

            expect(this.allaTyrell.location).toBe('hand');
            expect(this.player1Object.faction.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
