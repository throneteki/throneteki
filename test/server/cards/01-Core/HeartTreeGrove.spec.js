describe('Heart Tree Grove', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Hedge Knight', 'Winterfell Steward', 'Tumblestone Knight'],
                inPlay: ['Heart Tree Grove']
            }
        });
    });

    it('cannot be used outside the marshaling phase', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');

        expect(this.player1.actionUnavailableReason(this.heartTreeGrove)).toBe('phase');
    });

    describe('when used', function () {
        beforeEach(function () {
            this.player1.clickCard(this.heartTreeGrove);
        });

        it('kneels it', function () {
            expect(this.heartTreeGrove.kneeled).toBe(true);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 kneels Heart Tree Grove to reduce the cost of the next stark card they marshal this phase by 1'
            );
        });

        it('reduces the cost of the next [stark] card you marshal by 1, and only that one', function () {
            this.player1.clickCard(this.hedgeKnight);

            expect(this.player1Object.gold).toBe(3);

            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.player1Object.gold).toBe(2);

            this.player1.clickCard(this.winterfellSteward);

            expect(this.player1Object.gold).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
