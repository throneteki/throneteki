describe("Mother's Men", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Crown of Gold (TRtW)'],
                discard: ["Mother's Men"]
            },
            player2: {
                inPlay: ['Bastard in Hiding']
            }
        });

        this.player1.clickCard(this.crownOfGold);
        this.player1.clickCard(this.bastardInHiding);
        this.player1.triggerAbility(this.mothersMen);
    });

    it("puts itself into play from your discard pile after an opponent's character is killed by a card effect", function () {
        expect(this.mothersMen.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe("Mother's Men reacting from the discard pile", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Crown of Gold (TRtW)'],
                discard: ["Mother's Men", "Mother's Men"]
            },
            player2: {
                inPlay: ['Bastard in Hiding']
            }
        });

        this.player1.clickCard(this.crownOfGold);
        this.player1.clickCard(this.bastardInHiding);
    });

    it('names the card and its pile in the reaction prompt', function () {
        const buttons = this.player1.player.currentPrompt().buttons.map((b) => b.text);
        expect(buttons).toEqual(["Mother's Men (discard pile)", 'Pass']);
    });

    it('puts a copy into play from the named button', function () {
        this.player1.clickPrompt("Mother's Men (discard pile)");
        expect(
            this.player1Object.cardsInPlay.filter((card) => card.name === "Mother's Men")
        ).toHaveLength(1);
    });
});
