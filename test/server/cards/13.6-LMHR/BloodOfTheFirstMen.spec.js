describe('Blood of the First Men', function () {
    describe('during a challenge with a participating stark character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [
                        'Tumblestone Knight',
                        { card: 'Winterfell Steward', attachments: ['Blood of the First Men'] }
                    ]
                }
            });
            expect(this.winterfellSteward.hasTrait('Old Gods')).toBe(true);
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickMenu(this.bloodOfTheFirstMen, 'Participate in challenge');
        });

        it('kneels the attached character to have it participate on your side', function () {
            expect(this.winterfellSteward.kneeled).toBe(true);
            expect(this.winterfellSteward.isAttacking()).toBe(true);
        });
    });
});
