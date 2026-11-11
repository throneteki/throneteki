describe('Lord Protector of the Vale', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Littlefinger (Core)', attachments: ['Lord Protector of the Vale'] },
                    'Jon Arryn (AHaH)'
                ]
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.jonArryn);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.lordProtectorOfTheVale);
    });

    it('gives Littlefinger +2 STR, and kneels to have the attached character contribute its STR in a [power] challenge with a participating House Arryn character', function () {
        expect(this.littlefinger.getStrength()).toBe(6);
        expect(this.lordProtectorOfTheVale.kneeled).toBe(true);
        expect(this.game.currentChallenge.attackerStrength).toBe(9);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
