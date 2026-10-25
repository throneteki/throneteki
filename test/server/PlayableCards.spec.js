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

describe('playable card state when choosing a challenge', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Hedge Knight'],
                hand: ['Winterfell Steward']
            }
        });
        this.handCanPlay = (card) =>
            this.game
                .getState(this.player1.player.name)
                .players[
                    this.player1.player.name
                ].cardPiles.hand.find((summary) => summary.uuid === card.uuid)?.canPlay;
    });

    it('marks the cards a player cannot use now', function () {
        expect(this.player1).toHavePromptButton('Military');
        expect(this.handCanPlay(this.winterfellSteward)).toBe(false);
    });
});

describe('actions taken while choosing a challenge', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                gold: 0,
                inPlay: ['Grey Wind (Core)', 'Tumblestone Knight'],
                hand: ['Nightmares']
            },
            player2: { inPlay: ['Samwell Tarly (Core)', 'Bastard in Hiding'] }
        });
        this.player1.clickMenu(this.greyWind, 'Kneel Grey Wind to kill a character');
    });

    it('does not explain why cards are unavailable while a target is chosen', function () {
        const nightmares = () =>
            this.game
                .getState(this.player1.player.name)
                .players[
                    this.player1.player.name
                ].cardPiles.hand.find((card) => card.uuid === this.nightmares.uuid);
        expect(nightmares().unavailableActions).toBeUndefined();
        this.player1.clickCard(this.samwellTarly);
        expect(nightmares().unavailableActions).toEqual([
            { title: 'Blank a character or location', reason: 'cost' }
        ]);
    });

    it('does not warn that the action was outside an action window', function () {
        this.player1.clickCard(this.samwellTarly);
        expect(this.game.getPlainTextLog()).not.toContain('outside of an action window');
    });
});
