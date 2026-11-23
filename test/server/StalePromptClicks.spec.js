describe('card clicks from a closed prompt', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Winterfell Steward', 'Hedge Knight'] }
        });

        this.promptId = () => this.player1Object.getState(this.player1Object).promptId;
        this.click = (card, promptId) => {
            this.game.cardClicked(this.player1Object.name, card.uuid, promptId);
            this.game.continue();
        };
    });

    it('sends each player the id of their own prompt', function () {
        const marshaling = this.promptId();
        expect(marshaling).toEqual(expect.any(String));

        this.player1.clickPrompt('Done');

        expect(this.promptId()).toEqual(expect.any(String));
        expect(this.promptId()).not.toBe(marshaling);
        expect(this.player2Object.getState(this.player1Object).promptId).toBeUndefined();
        expect(this.player2).isReadyToTakeAction();
    });

    it('accepts a click from the prompt that is open', function () {
        this.click(this.winterfellSteward, this.promptId());

        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('accepts a click that names no prompt', function () {
        this.click(this.winterfellSteward);

        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('ignores a click from a prompt that has closed', function () {
        this.click(this.winterfellSteward, 'a-closed-prompt');

        expect(this.winterfellSteward.location).toBe('hand');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
