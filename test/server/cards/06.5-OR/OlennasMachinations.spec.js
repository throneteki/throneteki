describe("Olenna's Machinations", function () {
    it('lets you initiate an additional power challenge this phase', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Margaery Tyrell (HoT)', 'Cersei Lannister (LoCR)'],
                hand: ["Olenna's Machinations"]
            }
        });
        this.player1.clickCard(this.olennasMachinations);
        this.unopposedChallenge(this.player1, 'Power', this.margaeryTyrell);
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickPrompt('Done');
        expect(this.game.currentChallenge.isAttacking(this.cerseiLannister)).toBe(true);
    });

    it('pays 1 gold to return itself from your discard pile after you win an intrigue challenge by 5 or more STR', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Rhaegal (DotE)'], discard: ["Olenna's Machinations"] }
        });
        this.startingGold = this.player1Object.gold;
        this.unopposedChallenge(this.player1, 'Intrigue', this.rhaegal);
        this.player1.triggerAbility("Olenna's Machinations");
        expect(this.olennasMachinations.location).toBe('hand');
        expect(this.player1Object.gold).toBe(this.startingGold - 1);
    });
});
