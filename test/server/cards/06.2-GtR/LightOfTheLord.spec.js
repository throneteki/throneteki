describe('Light of the Lord', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    {
                        card: 'Melisandre (Core)',
                        kneeling: true,
                        attachments: ['Light of the Lord']
                    }
                ]
            }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.startingGold = this.player1Object.gold;
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility('Light of the Lord');
    });

    it('stands the attached character and gains 1 gold after the dominance phase begins', function () {
        expect(this.melisandre.kneeled).toBe(false);
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
