describe("A Traitor's Whisper", function () {
    function setup({ player2Shadows = ['Sparrows'], discard = ['Scheming Septon'] } = {}) {
        this.setupTest({
            player1: {
                faction: 'martell',
                hand: ["A Traitor's Whisper"],
                shadows: ['Sparrows'],
                discard
            },
            player2: { shadows: player2Shadows }
        });
        this.sparrows = this.player1.findCardByName('Sparrows', 'shadows');
        this.sparrows2 = player2Shadows.length
            ? this.player2.findCardByName('Sparrows', 'shadows')
            : null;
    }

    describe('when each player has a card in shadows', function () {
        beforeEach(function () {
            setup.call(this);
            this.player1.clickCard(this.aTraitorsWhisper);
        });

        it('lets you choose a card in shadows from each player', function () {
            expect(this.player2).toHavePrompt("Waiting for opponent to use A Traitor's Whisper");
            expect(this.player1).toHavePrompt('Select a card in each players shadow area, if able');
            expect(this.player1).toBeAbleToSelect(this.sparrows);
            expect(this.player1).toBeAbleToSelect(this.sparrows2);
        });

        it('reveals them and lets you put them into play', function () {
            this.player1.clickCard(this.sparrows);
            this.player1.clickCard(this.sparrows2);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Yes');
            expect(this.sparrows.location).toBe('play area');
            expect(this.sparrows2.location).toBe('play area');
        });

        it('lets you leave them in shadows', function () {
            this.player1.clickCard(this.sparrows);
            this.player1.clickCard(this.sparrows2);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('No');
            expect(this.sparrows.location).toBe('shadows');
            expect(this.sparrows2.location).toBe('shadows');
        });
    });

    it('chooses only from the players who have a card in shadows', function () {
        setup.call(this, { player2Shadows: [] });
        this.player1.clickCard(this.aTraitorsWhisper);
        this.player1.clickCard(this.sparrows);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Yes');
        expect(this.sparrows.location).toBe('play area');
    });

    it('can only be played if there is a card with shadow in your discard pile', function () {
        setup.call(this, { discard: ['Hedge Knight'] });
        expect(this.player1.actionUnavailableReason(this.aTraitorsWhisper)).toBe('condition');
    });
});
