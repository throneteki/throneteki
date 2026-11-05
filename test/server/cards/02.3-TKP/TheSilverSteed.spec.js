describe('The Silver Steed', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Horselord', attachments: ['The Silver Steed'] },
                    'Northern Refugee'
                ]
            }
        });
        this.unopposedChallenge(this.player1, 'Power', this.horselord);
        this.player1.triggerAbility('The Silver Steed');
    });

    it('sacrifices itself after the attached character gains power using renown, then allows an additional power challenge', function () {
        expect(this.theSilverSteed.location).toBe('discard pile');
        expect(this.horselord.power).toBe(1);
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.northernRefugee);
        this.player1.clickPrompt('Done');
        expect(this.game.currentChallenge.challengeType).toBe('power');
        expect(this.game.currentChallenge.isAttacking(this.northernRefugee)).toBe(true);
    });
});
