describe('an attachment waiting for its target', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ["Red God's Blessing"],
                inPlay: ['Dragonstone Faithful']
            },
            player2: {
                hand: ['Hedge Knight']
            }
        });
        this.attachment = this.player1.findCardByName("Red God's Blessing", 'hand');
        this.character = this.player1.findCardByName('Dragonstone Faithful', 'play area');

        const summaryOf = (viewer, owner) =>
            this.game
                .getState(viewer.name)
                .players[
                    owner.name
                ].cardPiles.hand.find((card) => card.uuid === this.attachment.uuid);
        this.summaryFor = (viewer) => summaryOf(viewer, this.player1.player);
    });

    it('is not marked before it is played', function () {
        expect(this.summaryFor(this.player1.player).beingAttached).toBeFalsy();
    });

    describe('while the target is being chosen', function () {
        it('is asking for the target', function () {
            this.player1.clickCard(this.attachment);

            expect(this.player1).toHavePrompt('Select target for attachment');
        });

        beforeEach(function () {
            this.player1.clickCard(this.attachment);
        });

        it('is marked as being attached for its controller', function () {
            expect(this.summaryFor(this.player1.player).beingAttached).toBe(true);
        });

        it('is shown face up to the opponent, who otherwise cannot see the hand', function () {
            const summary = this.summaryFor(this.player2.player);

            expect(summary.beingAttached).toBe(true);
            expect(summary.code).toBe(this.attachment.cardData.code);
        });

        it('cannot be cancelled once paid for', function () {
            expect(this.player1).toHaveDisabledPromptButton('Done');
            expect(this.player1).not.toHavePromptButton('Cancel');
        });

        it('is not marked once it is attached', function () {
            this.player1.clickCard(this.character);

            expect(this.character.attachments).toContain(this.attachment);
            expect(this.attachment.location).toBe('play area');
            expect(this.game.pendingAttachments.size).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    it('keeps other cards in hand hidden from the opponent', function () {
        const hedgeKnight = this.player2.findCardByName('Hedge Knight', 'hand');
        const summary = this.game
            .getState(this.player1.player.name)
            .players[
                this.player2.player.name
            ].cardPiles.hand.find((card) => card.uuid === hedgeKnight.uuid);

        expect(summary.code).toBeUndefined();
        expect(summary.facedown).toBe(true);
    });
});
