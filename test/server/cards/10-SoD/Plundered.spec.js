describe('Plundered', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'] },
            player2: {
                inPlay: [
                    {
                        card: 'Casterly Rock (Core)',
                        attachments: [{ card: 'Plundered', owner: 'player1' }]
                    }
                ]
            }
        });
        this.startingGold = this.player1Object.gold;
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
    });

    it('kneels the attached location after its controller loses as the defender, then may be sacrificed for 3 gold', function () {
        this.player1.triggerAbility('Plundered');
        this.player1.clickPrompt('Yes');
        expect(this.casterlyRock.kneeled).toBe(true);
        expect(this.plundered.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(this.startingGold + 3);
    });

    it('stays attached if you decline', function () {
        this.player1.triggerAbility('Plundered');
        this.player1.clickPrompt('No');
        expect(this.casterlyRock.kneeled).toBe(true);
        expect(this.plundered.location).toBe('play area');
    });
});
