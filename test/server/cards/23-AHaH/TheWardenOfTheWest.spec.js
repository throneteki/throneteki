describe('The Warden of the West', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Tywin Lannister (Core)', attachments: ['The Warden of the West'] }
                ]
            },
            player2: {
                hand: ['Tumblestone Knight']
            }
        });
    });

    it('gives the attached character the Commander trait and renown, and draws a card for each card discarded from an opponent during its challenge', function () {
        expect(this.tywinLannister.hasTrait('Commander')).toBe(true);
        expect(this.tywinLannister.hasKeyword('Renown')).toBe(true);

        this.unopposedChallenge(this.player1, 'Intrigue', this.tywinLannister);
        this.player1.triggerAbility(this.theWardenOfTheWest);

        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
