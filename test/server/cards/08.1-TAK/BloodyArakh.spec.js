describe('Bloody Arakh', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Braided Warrior', attachments: ['Bloody Arakh'] },
                    'Tumblestone Knight'
                ]
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.braidedWarrior);
        this.player1.triggerAbility(this.bloodyArakh);
    });

    it('is sacrificed to let you initiate an additional military challenge after you win a military challenge with the attached character', function () {
        expect(this.bloodyArakh.location).toBe('discard pile');
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
