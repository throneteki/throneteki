describe('Lord Commander', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Old Bear Mormont (Core)', attachments: ['Lord Commander'] }]
            }
        });
        this.unopposedChallenge(this.player1, 'Power', this.oldBearMormont);
        this.player1.triggerAbility(this.lordCommander);
    });

    it('gives the attached character 1 power after you win a challenge with a participating thenightswatch character', function () {
        expect(this.oldBearMormont.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
