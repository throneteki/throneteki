describe('Queen of the Seven Kingdoms', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Margaery Tyrell (Core)', attachments: ['Queen of the Seven Kingdoms'] }
                ]
            },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        expect(this.margaeryTyrell.hasTrait('Queen')).toBe(true);
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.margaeryTyrell);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.queenOfTheSevenKingdoms);
        this.player1.clickCard(this.khalDrogo);
    });

    it('gives the attached character the Queen trait, and stands and removes it from the challenge to stand and remove a participating character', function () {
        expect(this.margaeryTyrell.kneeled).toBe(false);
        expect(this.margaeryTyrell.isParticipating()).toBe(false);
        expect(this.khalDrogo.kneeled).toBe(false);
        expect(this.khalDrogo.isParticipating()).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
