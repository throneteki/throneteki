describe('Fever Dreams', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player2: {
                inPlay: [
                    {
                        card: 'Khal Drogo (Core)',
                        attachments: [{ card: 'Fever Dreams', owner: 'player1', gold: 1 }]
                    }
                ]
            }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility(this.feverDreams);
    });

    it('discards 1 gold from itself to draw 2 cards after the attached character is knelt', function () {
        expect(this.feverDreams.gold).toBe(0);
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
