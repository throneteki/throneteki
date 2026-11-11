describe('Warhammer', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [
                    { card: 'Tumblestone Knight', attachments: ['Warhammer'] },
                    { card: 'Ser Jaime Lannister (Core)', attachments: ['Warhammer'] }
                ]
            }
        });
    });

    it('gives +2 STR to a character with printed STR 4 or lower, and intimidate to one with printed STR 5 or higher', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(4);
        expect(this.tumblestoneKnight.hasKeyword('Intimidate')).toBe(false);
        expect(this.serJaimeLannister.getStrength()).toBe(5);
        expect(this.serJaimeLannister.hasKeyword('Intimidate')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
