describe('ability limits are player specific', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Tris Botley'], discard: ['Tumblestone Knight'] },
            player2: { faction: 'stark', hand: ['Ward (R)'], discard: ['Hedge Knight'], gold: 4 }
        });
        this.player1.clickMenu(this.trisBotley, 'Remove card from game');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('stops the player who used the ability using it again', function () {
        expect(this.player1.actionUnavailableReason(this.trisBotley)).toBe('limit');
        expect(this.player1).isReadyToTakeAction();
    });

    describe('when another player takes control of the card', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.ward);
            this.player2.clickCard(this.trisBotley);
        });

        it('lets that player use the ability up to its limit', function () {
            expect(this.trisBotley.controller).toBe(this.player2Object);

            this.player2.clickMenu(this.trisBotley, 'Remove card from game');
            this.player2.clickCard(this.tumblestoneKnight);

            expect(this.tumblestoneKnight.location).toBe('out of game');
            expect(this.player2.actionUnavailableReason(this.trisBotley)).toBe('limit');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
