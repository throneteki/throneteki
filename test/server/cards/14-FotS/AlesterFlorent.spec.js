describe('Alester Florent', function () {
    it('draws 1 card after a House Florent character enters play', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Alester Florent'], drawDeck: ['Hedge Knight'] }
        });
        this.player1.clickCard(this.alesterFlorent);
        this.player1.triggerAbility('Alester Florent');
        expect(this.hedgeKnight.location).toBe('hand');
    });

    it("kneels an opponent's character when it leaves play while you control another R'hllor character", function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Alester Florent', 'Acolyte of the Shadow (ChoS)'] },
            player2: { inPlay: ['Hedge Knight', 'Castle Guard'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.alesterFlorent);
        this.player1.triggerAbility('Alester Florent');
        this.player1.clickCard(this.castleGuard);
        expect(this.alesterFlorent.location).toBe('dead pile');
        expect(this.castleGuard.kneeled).toBe(true);
    });
});
