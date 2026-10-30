describe('Wedding at the Wall', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Northern Refugee', 'Acolyte of the Shadow (ChoS)'],
                hand: ['Wedding at the Wall']
            }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.northernRefugee);
        this.player1.clickCard(this.acolyteOfTheShadow);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('Wedding at the Wall');
        this.player1.clickCard(this.northernRefugee);
        this.player1.clickCard(this.acolyteOfTheShadow);
        this.player1.clickPrompt('Done');
    });

    it("stands 2 R'hllor or Wildling characters after winning a power challenge as the attacker", function () {
        expect(this.northernRefugee.kneeled).toBe(false);
        expect(this.acolyteOfTheShadow.kneeled).toBe(false);
    });
});
