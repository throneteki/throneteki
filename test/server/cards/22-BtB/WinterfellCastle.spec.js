describe('Winterfell Castle (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Winterfell Castle (BtB)', 'Eddard Stark (Core)'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        expect(this.eddardStark.hasTrait('Old Gods')).toBe(true);
        expect(this.eddardStark.hasKeyword('insight')).toBe(true);
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.eddardStark);
        this.player1.triggerAbility(this.winterfellCastle);
    });

    it('gives your highest cost unique stark character the Old Gods trait and insight, and kneels an Old Gods card to save it', function () {
        expect(this.eddardStark.location).toBe('play area');
        expect(this.eddardStark.kneeled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
