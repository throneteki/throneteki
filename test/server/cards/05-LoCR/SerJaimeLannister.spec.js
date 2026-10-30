describe('Ser Jaime Lannister (LoCR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Ser Jaime Lannister (LoCR)', 'Ser Parmen Crane']
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.serJaimeLannister);
        this.player1.clickPrompt('Done');
    });

    it('gives Knights you control renown while attacking alone, and gives a Kingsguard character an intrigue icon', function () {
        expect(this.serJaimeLannister.hasKeyword('renown')).toBe(true);

        this.player1.clickCard(this.serJaimeLannister);
        this.player1.clickCard(this.serParmenCrane);

        expect(this.serParmenCrane.hasIcon('intrigue')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
