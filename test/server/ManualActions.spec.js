describe('ManualActions', function () {
    beforeEach(function () {
        this.setupTest({
            gameOptions: { manualMode: true },
            player1: {
                hand: ['Hedge Knight'],
                inPlay: ['Winterfell Steward', 'Tumblestone Knight', 'Bastard in Hiding']
            },
            player2: {
                inPlay: ['House Dayne Knight']
            }
        });

        this.manualActionsFor = (player) =>
            this.game.stats.getPlayerStats(player.player).manualActions;
    });

    it('records a chat command and the card it was used on', function () {
        this.player1.sendChat('/kill');
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.manualActionsFor(this.player1)).toEqual([
            expect.objectContaining({
                action: '/kill',
                args: [],
                phase: 'marshal',
                round: 1,
                cards: [{ code: this.tumblestoneKnight.code, name: 'Tumblestone Knight' }]
            })
        ]);
        expect(this.manualActionsFor(this.player2)).toEqual([]);
        expect(this.player1).isReadyToTakeAction();
    });

    it('records the abilities that resolved before the manual action', function () {
        this.player1.clickCard(this.winterfellSteward);
        this.player1.sendChat('/power 2');
        this.player1.clickCard(this.bastardInHiding);

        expect(this.manualActionsFor(this.player1)).toEqual([
            expect.objectContaining({
                action: '/power',
                args: ['2'],
                cards: [{ code: this.bastardInHiding.code, name: 'Bastard in Hiding' }],
                recentAbilities: [{ code: this.winterfellSteward.code, name: 'Winterfell Steward' }]
            })
        ]);
        expect(this.player1).isReadyToTakeAction();
    });

    it('records dragging a card', function () {
        this.player1.dragCard(this.bastardInHiding, 'discard pile');

        expect(this.bastardInHiding.location).toBe('discard pile');
        expect(this.manualActionsFor(this.player1)).toEqual([
            expect.objectContaining({
                action: 'drop',
                args: ['play area', 'discard pile'],
                cards: [{ code: this.bastardInHiding.code, name: 'Bastard in Hiding' }]
            })
        ]);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not record a drag that is refused', function () {
        this.player1.dragCard(this.bastardInHiding, 'plot deck');

        expect(this.bastardInHiding.location).toBe('play area');
        expect(this.manualActionsFor(this.player1)).toEqual([]);
        expect(this.player1).isReadyToTakeAction();
    });

    it('records clicking a card to kneel it', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.manualActionsFor(this.player1)).toEqual([
            expect.objectContaining({
                action: 'kneel',
                cards: [{ code: this.tumblestoneKnight.code, name: 'Tumblestone Knight' }]
            })
        ]);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not kneel a card in hand that is clicked but cannot be played', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.hedgeKnight);

        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.hedgeKnight.kneeled).toBe(false);
        expect(this.manualActionsFor(this.player1)).toEqual([]);
    });

    it('records changing a stat', function () {
        this.game.changeStat(this.player1.name, 'gold', 2);

        expect(this.manualActionsFor(this.player1)).toEqual([
            expect.objectContaining({ action: 'changeStat', args: ['gold', 2] })
        ]);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not record commands that do not change the game', function () {
        this.player1.sendChat('/mute-spectators');

        expect(this.manualActionsFor(this.player1)).toEqual([]);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not record using a card ability', function () {
        this.player1.clickCard(this.winterfellSteward);

        expect(this.winterfellSteward.kneeled).toBe(true);
        expect(this.manualActionsFor(this.player1)).toEqual([]);
        expect(this.player1).isReadyToTakeAction();
    });
});
