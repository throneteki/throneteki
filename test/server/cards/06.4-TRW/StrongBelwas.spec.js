describe('Strong Belwas', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                inPlay: [{ card: 'Strong Belwas', gold: 1 }, 'Daenerys Targaryen (Core)']
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
        this.player1.clickCard(this.daenerysTargaryen);
        this.player1.triggerAbility(this.strongBelwas);
    });

    it('discards 1 gold to save another unique targaryen character that would be killed', function () {
        expect(this.strongBelwas.gold).toBe(0);
        expect(this.daenerysTargaryen.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
