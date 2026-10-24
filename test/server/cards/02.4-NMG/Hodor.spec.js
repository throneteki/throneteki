describe('Hodor', function () {
    function setup(context, inPlay) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                inPlay
            }
        });
    }

    it('cannot be declared as an attacker unless you control Bran Stark, and does not contribute to dominance', function () {
        setup(this, ['Hodor', 'Tumblestone Knight']);

        expect(this.player1Object.getDominance()).toBe(
            this.player1Object.gold + this.tumblestoneKnight.getStrength()
        );

        this.player1.clickPrompt('Power');

        expect(this.player1).not.toBeAbleToSelect(this.hodor);

        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });

    it('can be declared as an attacker while you control Bran Stark', function () {
        setup(this, ['Hodor', 'Bran Stark (Core)']);

        this.unopposedChallenge(this.player1, 'Power', this.hodor);

        expect(this.hodor.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
