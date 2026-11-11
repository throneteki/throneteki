describe("The Prince's Plan", function () {
    it('gives a character +1 STR for each used plot and a challenge icon of your choice', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                usedPlots: ['A Noble Cause', 'Sneak Attack'],
                inPlay: ['Hedge Knight'],
                hand: ["The Prince's Plan"]
            }
        });
        this.player1.clickCard(this.thePrincesPlan);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Intrigue');
        expect(this.hedgeKnight.getStrength()).toBe(this.hedgeKnight.getPrintedStrength() + 2);
        expect(this.hedgeKnight.hasIcon('intrigue')).toBe(true);
    });

    it('pays 1 gold to return itself to your hand from your discard pile after you lose a challenge', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], discard: ["The Prince's Plan"] },
            player2: { inPlay: ['Robb Stark (Core)'] }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.robbStark);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).toAllowAbilityTrigger("The Prince's Plan");
        this.player1.triggerAbility("The Prince's Plan");
        expect(this.thePrincesPlan.location).toBe('hand');
        expect(this.player1Object.gold).toBe(this.startingGold - 1);
    });
});
