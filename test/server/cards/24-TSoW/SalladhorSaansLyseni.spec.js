describe("Salladhor Saan's Lyseni (TSoW)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["Salladhor Saan's Lyseni (TSoW)"] },
            player2: {
                inPlay: [
                    { card: 'The Kingsroad', kneeling: true },
                    { card: 'The Roseroad', kneeling: true }
                ]
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.salladhorSaansLyseni);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.salladhorSaansLyseni);
    });

    it('gains 1 power for every 2 kneeling locations the defending player controls after it wins attacking', function () {
        expect(this.salladhorSaansLyseni.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
