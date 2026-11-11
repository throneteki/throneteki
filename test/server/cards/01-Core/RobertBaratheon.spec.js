describe('Robert Baratheon (Core)', function () {
    describe('with other kneeling characters in play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: [
                        'Robert Baratheon (Core)',
                        { card: 'Tumblestone Knight', kneeling: true }
                    ]
                },
                player2: { inPlay: [{ card: 'Hedge Knight', kneeling: true }, 'Castle Guard'] }
            });
        });

        it('gets +1 STR for each other kneeling character in play', function () {
            expect(this.robertBaratheon.getStrength()).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
