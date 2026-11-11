describe("King's Hunting Party", function () {
    describe('while an opponent controls a King', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ["King's Hunting Party"] },
                player2: {
                    inPlay: [{ card: 'The Red Viper (Core)', attachments: ['The Boy King'] }]
                }
            });
        });

        it('gains an intrigue icon', function () {
            expect(this.kingsHuntingParty.hasIcon('intrigue')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while no opponent controls a King', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ["King's Hunting Party"] },
                player2: { inPlay: ['The Red Viper (Core)'] }
            });
        });

        it('does not gain an intrigue icon', function () {
            expect(this.kingsHuntingParty.hasIcon('intrigue')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
