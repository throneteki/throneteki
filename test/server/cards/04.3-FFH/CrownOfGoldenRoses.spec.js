describe('Crown of Golden Roses', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    { card: 'Ser Jaime Lannister (Core)', attachments: ['Crown of Golden Roses'] }
                ],
                hand: ['Burned Men']
            }
        });
    });

    it('gives the attached character the King trait, and discards a card to give it +1 STR for each of its challenge icons', function () {
        expect(this.serJaimeLannister.hasTrait('King')).toBe(true);

        this.player1.clickCard(this.crownOfGoldenRoses);
        this.player1.clickCard(this.burnedMen);

        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.serJaimeLannister.getStrength()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
