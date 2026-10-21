describe('Silence (JS)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Silence (JS)', 'Orkmont Reaver']
            },
            player2: {
                discard: [
                    'House Maester',
                    'House Maester',
                    'House Maester',
                    'House Maester',
                    'House Maester',
                    'House Maester',
                    'House Maester',
                    'House Maester',
                    'House Maester',
                    'House Maester'
                ]
            }
        });
    });

    it('gives each Raider character you control pillage, and +1 STR while an opponent has 10 or more cards in their discard pile', function () {
        expect(this.orkmontReaver.hasKeyword('Pillage')).toBe(true);
        expect(this.orkmontReaver.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
