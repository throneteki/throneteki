describe('Shadow Priestess', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'baratheon', shadows: ['Shadow Priestess'], gold: 3 },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.shadowPriestess);
        this.player1.triggerAbility(this.shadowPriestess);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels a character without attachments after it comes out of shadows', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
