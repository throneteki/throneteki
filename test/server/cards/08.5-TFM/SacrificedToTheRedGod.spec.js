describe('Sacrificed to the Red God', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Sacrificed to the Red God'],
                inPlay: ['Acolyte of the Shadow (ChoS)', 'Tumblestone Knight'],
                drawDeck: ['Lem Lemoncloak', 'Anguy the Archer']
            }
        });

        this.player1.clickCard(this.sacrificedToTheRedGod);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it("sacrifices a character to search your deck for a R'hllor character with equal or lower printed cost", function () {
        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.player1).not.toBeAbleToSelect(this.lemLemoncloak);

        this.player1.clickCard(this.anguyTheArcher);

        expect(this.anguyTheArcher.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
