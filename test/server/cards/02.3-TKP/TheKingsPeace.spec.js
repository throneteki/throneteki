describe("The King's Peace", function () {
    function setup(player2) {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: "The King's Peace" },
            player2: { inPlay: ['Hedge Knight'], ...player2 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility("The King's Peace");
    }

    it('lets the attacking player kneel their faction card to continue the challenge', function () {
        setup.call(this, {});
        this.player2.clickPrompt('Kneel faction card');
        expect(this.player2Object.faction.kneeled).toBe(true);
        expect(this.hedgeKnight.isAttacking()).toBe(true);
    });

    it('lets them move 1 power to your faction card instead', function () {
        setup.call(this, { power: 1 });
        this.player2.clickPrompt('Move 1 power');
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.hedgeKnight.isAttacking()).toBe(true);
    });

    it('ends the challenge if they do neither', function () {
        setup.call(this, {});
        this.player2.clickPrompt('Cancel Challenge');
        expect(this.hedgeKnight.isAttacking()).toBe(false);
    });

    it('ends the challenge if they cannot do either', function () {
        setup.call(this, { factionKneeling: true });
        expect(this.hedgeKnight.isAttacking()).toBe(false);
    });
});
