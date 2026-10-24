describe('Glamor', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Eddard Stark (Core)', attachments: ['Glamor'] },
                    'Tumblestone Knight'
                ]
            },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        expect(this.eddardStark.getStrength()).toBe(7);
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.glamor);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('gives the attached character +2 STR, and kills it to put a character killed this phase into play from your dead pile', function () {
        expect(this.eddardStark.location).toBe('dead pile');
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
