describe('"The Dornishman\'s Wife" (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['"The Dornishman\'s Wife" (R)'],
                inPlay: ['Khal Drogo (Core)']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.khalDrogo);
    });

    it('gains 2 gold for a killed unique character with a [military] icon, and gives it 2 power for a [power] icon', function () {
        this.player1.triggerAbility(this.theDornishmansWife);

        expect(this.player1Object.gold).toBe(6);
        expect(this.khalDrogo.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
