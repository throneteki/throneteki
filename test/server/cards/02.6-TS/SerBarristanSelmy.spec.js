describe('Ser Barristan Selmy (TS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Ser Barristan Selmy (TS)', kneeling: true },
                    'Eddard Stark (Core)'
                ]
            },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.eddardStark);
        this.player1.triggerAbility(this.serBarristanSelmy);
    });

    it('stands to save a Lord or Lady character you control from being killed', function () {
        expect(this.eddardStark.location).toBe('play area');
        expect(this.serBarristanSelmy.kneeled).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
