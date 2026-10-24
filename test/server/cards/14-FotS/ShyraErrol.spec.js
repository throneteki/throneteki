describe('Shyra Errol', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Shyra Errol', { card: 'Tumblestone Knight', power: 2 }]
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it("is sacrificed to move each power from a character being killed to its controller's faction card", function () {
        this.player1.triggerAbility(this.shyraErrol);

        expect(this.shyraErrol.location).toBe('discard pile');
        expect(this.player1Object.faction.power).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
