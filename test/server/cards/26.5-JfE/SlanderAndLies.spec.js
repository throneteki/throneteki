describe('Slander and Lies', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player2: {
                inPlay: [
                    {
                        card: 'Tumblestone Knight',
                        attachments: [{ card: 'Slander and Lies', owner: 'player1' }]
                    }
                ]
            }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.tumblestoneKnight);
    });

    it('has the attached character gain 1 power after you lose a challenge it participates in', function () {
        expect(this.tumblestoneKnight.power).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
