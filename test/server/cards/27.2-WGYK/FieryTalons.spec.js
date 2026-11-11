describe('Fiery Talons (WGYK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Melisandre (Core)', 'Hedge Knight'],
                hand: ['Fiery Talons (WGYK)']
            },
            player2: { inPlay: ['Tumblestone Knight', 'Old Forest Hunter (Core)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickCard(this.oldForestHunter);
        this.player2.clickPrompt('Done');
        this.goldBefore = this.player1Object.gold;
        this.player1.clickCard(this.fieryTalons);
    });

    it("kneels a R'hllor character as its cost", function () {
        expect(this.player1).toHavePrompt('Select card to kneel');
        expect(this.player1).toBeAbleToSelect(this.melisandre);
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
    });

    it('gives a participating character -1 STR until the end of the phase', function () {
        this.player1.clickCard(this.melisandre);
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.getStrength()).toBe(1);
        expect(this.melisandre.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(this.goldBefore);
        expect(this.tumblestoneKnight.location).toBe('play area');
    });

    it('places the character in shadows if its STR is 0', function () {
        this.player1.clickCard(this.melisandre);
        this.player1.clickCard(this.oldForestHunter);

        expect(this.oldForestHunter.location).toBe('shadows');
    });
});
