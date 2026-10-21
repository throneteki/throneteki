describe('Orkmont Reaver', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Orkmont Reaver']
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

    it('gains stealth while an opponent has 10 or more cards in their discard pile', function () {
        expect(this.orkmontReaver.hasKeyword('Stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
