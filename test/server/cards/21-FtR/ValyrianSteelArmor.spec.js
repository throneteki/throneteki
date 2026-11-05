describe('Valyrian Steel Armor', function () {
    describe("attached to Euron Crow's Eye", function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    inPlay: [
                        {
                            card: "Euron Crow's Eye (Core)",
                            attachments: ['Valyrian Steel Armor (FtR)']
                        }
                    ]
                },
                player2: { inPlay: ['Castle Guard'] }
            });
            this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
        });

        it('gives him insight and stops him being killed while you control no other non-Army character with printed cost 6 or higher', function () {
            expect(this.euronCrowsEye.hasKeyword('Insight')).toBe(true);
            expect(this.euronCrowsEye.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
