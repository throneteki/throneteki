describe('playable card state', function () {
    function handState(context, viewer, owner) {
        const state = context.game.getState(viewer.player.name);
        return state.players[owner.player.name].cardPiles.hand;
    }

    function canPlay(context, viewer, owner, card) {
        return handState(context, viewer, owner).find((summary) => summary.uuid === card.uuid)
            ?.canPlay;
    }

    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Hedge Knight', 'Robb Stark (AtSK)']
            },
            player2: {
                hand: ['Winterfell Steward']
            }
        });
    });

    it('marks the cards a player can use now', function () {
        expect(canPlay(this, this.player1, this.player1, this.hedgeKnight)).toBe(true);
        expect(canPlay(this, this.player1, this.player1, this.robbStark)).toBe(false);
    });

    it('does not mark cards while it is not that player’s turn', function () {
        expect(canPlay(this, this.player2, this.player2, this.winterfellSteward)).toBeUndefined();
    });

    it('moves the marks to the next player in the window', function () {
        this.player1.clickPrompt('Done');

        expect(canPlay(this, this.player1, this.player1, this.hedgeKnight)).toBeUndefined();
        expect(canPlay(this, this.player2, this.player2, this.winterfellSteward)).toBe(true);
    });
});
