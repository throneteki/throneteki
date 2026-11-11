describe('Boots (ChoS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Boots (ChoS)'],
                inPlay: [
                    'Joffrey Baratheon (Core)',
                    'Ser Jaime Lannister (Core)',
                    'Tumblestone Knight'
                ]
            }
        });

        this.player1.clickCard(this.boots);
    });

    it('can only be attached to a unique character with printed cost 3 or lower, which gains renown', function () {
        expect(this.player1).toBeAbleToSelect(this.joffreyBaratheon);
        expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.joffreyBaratheon);

        expect(this.joffreyBaratheon.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
