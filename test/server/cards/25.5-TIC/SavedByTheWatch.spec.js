describe('Saved by the Watch', function () {
    beforeEach(function () {
        this.setupTest({
            firstPlayer: 'player2',
            player1: { faction: 'thenightswatch', hand: ['Saved by the Watch'] },
            player2: {
                inPlay: ['Handmaiden', { card: 'Sansa Stark (Core)', kneeling: true }]
            }
        });
        this.player2.clickMenu(this.handmaiden, 'Stand a Lady');
        this.player1.triggerAbility('Saved by the Watch');
        this.player2.clickCard(this.sansaStark);
    });

    it("kneels your faction card to put an opponent's sacrificed character into play", function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.handmaiden.location).toBe('play area');
    });

    it('then attaches itself to it as a Condition that gives you control of it', function () {
        expect(this.savedByTheWatch.parent).toBe(this.handmaiden);
        expect(this.savedByTheWatch.getType()).toBe('attachment');
        expect(this.savedByTheWatch.hasTrait('Condition')).toBe(true);
        expect(this.savedByTheWatch.isTerminal()).toBe(true);
        expect(this.handmaiden).toBeControlledBy(this.player1);
        expect(this.sansaStark.kneeled).toBe(false);
    });
});
