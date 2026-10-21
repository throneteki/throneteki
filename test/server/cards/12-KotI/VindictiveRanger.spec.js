describe('Vindictive Ranger', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'thenightswatch', inPlay: ['Vindictive Ranger'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Intrigue');
        this.player2.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.vindictiveRanger);
        this.player1.clickPrompt('Power');
    });

    it('gains stealth and a challenge icon of your choice after you lose a challenge as the defending player', function () {
        expect(this.vindictiveRanger.hasKeyword('stealth')).toBe(true);
        expect(this.vindictiveRanger.hasIcon('power')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
