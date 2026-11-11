describe('Aeron Damphair (KotI)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: ['Aeron Damphair (KotI)', "Drowned God's Apostle"],
                drawDeck: ['Hot Pie (FFH)']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.drownedGodsApostle);
        this.player1.triggerAbility(this.aeronDamphair);
    });

    it('draws 1 card after another Drowned God character you control is killed', function () {
        expect(this.drownedGodsApostle.location).toBe('dead pile');
        expect(this.hotPie.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
