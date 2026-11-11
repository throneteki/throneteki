describe('The Drowned God Wakes', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Robb Stark (Core)', 'Tywin Lannister (Core)', 'Hedge Knight'],
                hand: ['The Drowned God Wakes'],
                gold: 5
            },
            player2: {
                inPlay: [
                    { card: 'Castle Guard', kneeling: true },
                    { card: 'Winterfell Steward', kneeling: true }
                ]
            }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility('The Drowned God Wakes');
        this.player1.clickCard(this.robbStark);
        this.player2.clickCard(this.castleGuard);
        this.player1.clickCard(this.tywinLannister);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
    });

    it('has each player choose a character they control and kills the rest after you win dominance by 10 or more', function () {
        expect(this.robbStark.location).toBe('play area');
        expect(this.castleGuard.location).toBe('play area');
        expect(this.tywinLannister.location).toBe('dead pile');
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.winterfellSteward.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
