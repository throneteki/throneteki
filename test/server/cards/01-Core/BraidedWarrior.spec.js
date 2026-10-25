describe('Braided Warrior', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Braided Warrior (Core)', 'Tumblestone Knight'],
                hand: ['Milk of the Poppy', "Widow's Wail (Core)"]
            }
        });
    });

    it('rejects non-Weapon attachments', function () {
        this.player1.clickCard(this.milkOfThePoppy);

        expect(this.player1).not.toBeAbleToSelect(this.braidedWarrior);
        expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');

        expect(this.milkOfThePoppy.parent).toBe(this.tumblestoneKnight);
        expect(this.player2).isReadyToTakeAction();
    });

    it('allows Weapon attachments', function () {
        this.player1.clickCard(this.widowsWail);
        expect(this.player1).toBeAbleToSelect(this.braidedWarrior);
        this.player1.clickCard(this.braidedWarrior);

        expect(this.widowsWail.parent).toBe(this.braidedWarrior);
        expect(this.player1).isReadyToTakeAction();
    });
});
