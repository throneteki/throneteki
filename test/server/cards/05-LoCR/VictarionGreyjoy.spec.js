describe('Victarion Greyjoy (LoCR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: [{ card: 'Victarion Greyjoy (LoCR)', power: 2 }]
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
        this.player1.clickCard(this.victarionGreyjoy);
        this.player1.triggerAbility(this.victarionGreyjoy);
    });

    it('discards 2 power from himself to save himself', function () {
        expect(this.victarionGreyjoy.power).toBe(0);
        expect(this.victarionGreyjoy.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
