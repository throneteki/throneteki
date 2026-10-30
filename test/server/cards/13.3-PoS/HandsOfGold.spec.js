describe('"Hands of Gold"', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['"Hands of Gold"'],
                inPlay: ['Cersei Lannister (Core)', 'Ser Jaime Lannister (Core)']
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickCard(this.serJaimeLannister);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.handsOfGold);
    });

    it("returns a character the losing opponent controls to its owner's hand after you win an intrigue challenge by 5 or more as the attacker, where intrigue claim then discards it", function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
