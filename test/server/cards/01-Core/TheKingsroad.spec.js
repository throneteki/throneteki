describe('The Kingsroad', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'A Noble Cause',
                hand: ['Little Bird (Core)', 'Palace Spearman', 'Hedge Knight'],
                inPlay: ['The Kingsroad', 'Tumblestone Knight']
            },
            player2: {
                plot: 'A Song of Summer'
            }
        });
    });

    it('gives its controller +1 initiative', function () {
        expect(this.player1Object.getInitiative()).toBe(1);
    });

    it('cannot be used outside the marshaling phase', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');

        expect(this.player1.actionUnavailableReason(this.theKingsroad)).toBe('phase');
    });

    describe('when used', function () {
        beforeEach(function () {
            this.player1.clickCard(this.theKingsroad);
        });

        it('kneels and sacrifices it', function () {
            expect(this.theKingsroad.location).toBe('discard pile');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 kneels and sacrifices The Kingsroad to reduce the cost of the next character they marshal this phase by 3'
            );
        });

        it('reduces the cost of the next character you marshal this phase by 3, and only that one', function () {
            this.player1.clickCard(this.littleBird);
            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.player1Object.gold).toBe(4);

            this.player1.clickCard(this.palaceSpearman);

            expect(this.palaceSpearman.location).toBe('play area');
            expect(this.player1Object.gold).toBe(3);

            this.player1.clickCard(this.hedgeKnight);

            expect(this.player1Object.gold).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('expires at the end of the phase', function () {
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');

            expect(this.player1Object.getCostReduction('marshal', this.palaceSpearman)).toBe(0);
        });
    });
});
