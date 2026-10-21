describe('The Moon Door (ChoS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: [
                    'The Moon Door (ChoS)',
                    'Anya Waynwood',
                    'Ser Jaime Lannister (Core)',
                    'Tumblestone Knight'
                ]
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.player1.clickPrompt('player1');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.serJaimeLannister);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.anyaWaynwood);
        this.player1.clickCard(this.theMoonDoor);
        this.player1.triggerAbility(this.theMoonDoor);
    });

    it('kills a participating character with printed STR 3 or lower after it kneels during a challenge', function () {
        this.player1.clickCard(this.burnedMen);

        expect(this.theMoonDoor.kneeled).toBe(true);
        expect(this.burnedMen.location).toBe('dead pile');

        this.player1.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        expect(this.player1).isReadyToTakeAction();
    });
});
