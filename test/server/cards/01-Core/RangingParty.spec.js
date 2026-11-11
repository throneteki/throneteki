describe('Ranging Party', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Ranging Party (Core)', 'Tumblestone Knight'],
                hand: ['Milk of the Poppy', "Widow's Wail (Core)"]
            }
        });
    });

    it('rejects non-Weapon attachments', function () {
        this.player1.clickCard(this.milkOfThePoppy);

        expect(this.player1).not.toBeAbleToSelect(this.rangingParty);
        expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');

        expect(this.milkOfThePoppy.parent).toBe(this.tumblestoneKnight);
        expect(this.player2).isReadyToTakeAction();
    });

    it('allows Weapon attachments', function () {
        this.player1.clickCard(this.widowsWail);
        expect(this.player1).toBeAbleToSelect(this.rangingParty);
        this.player1.clickCard(this.rangingParty);

        expect(this.widowsWail.parent).toBe(this.rangingParty);
        expect(this.player1).isReadyToTakeAction();
    });
});
