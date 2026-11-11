describe('Tarle the Thrice-Drowned (FUtG)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tarle the Thrice-Drowned (FUtG)', 'Drowned Men', 'Tumblestone Knight']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.drownedMen);
    });

    it('puts a Drowned God character into play after it is placed in your dead pile, then kills a character you control', function () {
        this.player1.triggerAbility(this.tarleTheThriceDrowned);
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.drownedMen.location).toBe('play area');
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
