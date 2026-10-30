describe('Asshai Priestess', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'baratheon', hand: ['Asshai Priestess'], gold: 3 },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.asshaiPriestess);
        this.player1.triggerAbility(this.asshaiPriestess);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels a character with STR 2 or lower after you marshal it', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
