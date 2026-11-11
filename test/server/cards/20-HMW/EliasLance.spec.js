describe("Elia's Lance", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Elia Sand (JS)', attachments: ["Elia's Lance"] }] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.eliaSand);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.eliasLance);
    });

    it('gives Elia Sand stealth, and has the winning opponent return a defending character to hand after the attached character loses attacking', function () {
        expect(this.eliaSand.hasKeyword('stealth')).toBe(true);

        this.player2.clickCard(this.serJaimeLannister);

        expect(this.serJaimeLannister.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
