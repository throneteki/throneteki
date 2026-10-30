describe('Acolyte of the Waves', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Acolyte of the Waves'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.acolyteOfTheWaves);
        this.player1.triggerAbility(this.acolyteOfTheWaves);
    });

    it('gains 1 power for your faction when it is killed', function () {
        expect(this.acolyteOfTheWaves.location).toBe('dead pile');
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
