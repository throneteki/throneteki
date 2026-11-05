describe('Bear Island Scout (IDP)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Bear Island Scout (IDP)'],
                drawDeck: ['Tumblestone Knight', 'Dacey Mormont']
            }
        });

        this.player1.clickCard(this.bearIslandScout);
        this.player1.triggerAbility(this.bearIslandScout);
    });

    it('searches your deck for a House Mormont card after you marshal it while all your characters are [stark]', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.daceyMormont);

        expect(this.daceyMormont.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
