describe('Renly Baratheon (FFH)', function () {
    describe('after you draw a loyal card using insight', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Renly Baratheon (FFH)'],
                    drawDeck: ['Catelyn Stark (Core)', 'Hedge Knight']
                },
                player2: {
                    inPlay: [{ card: 'The Red Viper (Core)', attachments: ['The Boy King'] }]
                }
            });
            expect(this.renlyBaratheon.canBeSaved()).toBe(false);
            this.unopposedChallenge(this.player1, 'Power', this.renlyBaratheon);
            this.player1.triggerAbility(this.renlyBaratheon);
        });

        it('reveals it to draw 1 card', function () {
            expect(this.player1.findCardByName('Catelyn Stark', 'hand').location).toBe('hand');
            expect(this.player1.findCardByName('Hedge Knight', 'hand').location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
