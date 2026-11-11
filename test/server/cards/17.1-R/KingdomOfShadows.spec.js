describe('Kingdom of Shadows (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                agenda: 'Kingdom of Shadows (R)',
                hand: ['Ser Andrey Dalt']
            }
        });

        this.player1.clickCard(this.serAndreyDalt);
        this.player1.clickPrompt('Marshal into shadows');
    });

    it('increases the cost to marshal your cards into shadows by 1 while you control no in-faction characters', function () {
        expect(this.serAndreyDalt.location).toBe('shadows');
        expect(this.player1Object.gold).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
