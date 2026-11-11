describe('Renly Baratheon (FotS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'baratheon',
                inPlay: ['Renly Baratheon (FotS)'],
                hand: ['Tumblestone Knight']
            }
        });
        this.player1.clickCard(this.renlyBaratheon);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('has renown, and kneels your faction card to put a non-baratheon character with printed cost up to his STR into play from your hand', function () {
        expect(this.renlyBaratheon.hasKeyword('renown')).toBe(true);
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
