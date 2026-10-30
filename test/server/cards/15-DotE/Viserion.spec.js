describe('Viserion (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Viserion (DotE)', 'Daenerys Targaryen (Core)']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.viserion);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Done');
    });

    it('gives Stormborn characters stealth, and each participating non-Dragon non-Stormborn character -2 STR while he attacks', function () {
        expect(this.daenerysTargaryen.hasKeyword('Stealth')).toBe(true);
        expect(this.serJaimeLannister.getStrength()).toBe(2);

        this.skipActionWindow();
        this.player2.clickCard(this.serJaimeLannister);

        expect(this.player1).isReadyToTakeAction();
    });
});
