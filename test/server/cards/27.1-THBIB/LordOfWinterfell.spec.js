describe('Lord of Winterfell', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'The Winds of Winter',
                inPlay: [
                    { card: 'Eddard Stark (Core)', attachments: ['Lord of Winterfell'] },
                    'Grand Maester Pycelle (Core)'
                ]
            }
        });
    });

    it('gives the attached character insight while a Winter plot is revealed, and kneels to give it 1 power after you win a challenge with a participating loyal character', function () {
        expect(this.eddardStark.hasKeyword('insight')).toBe(true);

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.eddardStark);
        this.player1.clickCard(this.grandMaesterPycelle);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.lordOfWinterfell);

        expect(this.eddardStark.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
