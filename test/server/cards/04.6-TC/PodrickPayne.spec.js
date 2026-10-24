describe('Podrick Payne', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Podrick Payne (TC)'], inPlay: ['Tyrion Lannister (Core)'], gold: 4 },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.tyrionLannister);
        this.player1.triggerAbility('Podrick Payne');
    });

    it('pays 2 gold and comes into play to save a character killed for military claim, then may pay 2 gold to kill an attacker if it saved Tyrion', function () {
        expect(this.podrickPayne.location).toBe('play area');
        expect(this.tyrionLannister.location).toBe('play area');
        this.player1.clickPrompt('Yes');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.player1Object.gold).toBe(0);
    });
});
