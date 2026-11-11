describe('Mother of Dragons', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Daenerys Targaryen (Core)', attachments: ['Mother of Dragons'] },
                    'Drogon (Core)'
                ]
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.drogon);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.motherOfDragons);
    });

    it('kneels to have the attached character participate on your side', function () {
        expect(this.motherOfDragons.kneeled).toBe(true);
        expect(this.daenerysTargaryen.isAttacking()).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
