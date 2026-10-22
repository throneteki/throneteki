describe('Iron Victory', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Iron Victory', { card: 'Victarion Greyjoy (LoCR)', power: 2 }] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        expect(this.victarionGreyjoy.getStrength()).toBe(7);
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.victarionGreyjoy);
        this.player1.triggerAbility(this.victarionGreyjoy);
        this.player1.triggerAbility(this.ironVictory);
    });

    it('gives Victarion Greyjoy +1 STR for each power he has, and gives a saved greyjoy character 1 power', function () {
        expect(this.victarionGreyjoy.location).toBe('play area');
        expect(this.victarionGreyjoy.power).toBe(1);
        expect(this.victarionGreyjoy.getStrength()).toBe(6);
        expect(this.player2).isReadyToTakeAction();
    });
});
