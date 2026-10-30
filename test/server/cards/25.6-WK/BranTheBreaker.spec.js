describe('Bran the Breaker', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Bear Island', attachments: ['Bran the Breaker'] },
                    'Eddard Stark (Core)',
                    'Catelyn Stark (WotN)'
                ]
            }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.eddardStark);
        this.player1.clickCard(this.catelynStark);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.branTheBreaker);
    });

    it('kneels to raise your claim by 1 during a challenge with 2 or more unique attacking stark characters', function () {
        expect(this.player1Object.activePlot.getClaim()).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
