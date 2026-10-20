describe('At the Palace of Sorrows', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'At the Palace of Sorrows (R)',
                inPlay: [{ card: 'Hedge Knight', attachments: ['Strangler'] }]
            },
            player2: {
                inPlay: ['Bastard in Hiding']
            }
        });
    });

    it("sets each character's STR to 3", function () {
        expect(this.hedgeKnight.getStrength()).toBe(3);
        expect(this.bastardInHiding.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not raise a participating character above the STR Strangler sets', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');

        expect(this.hedgeKnight.getStrength()).toBe(1);
        expect(this.bastardInHiding.getStrength()).toBe(3);
        expect(this.player1).toHavePrompt('Initiate an action');
    });
});
