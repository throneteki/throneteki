describe('Windblown (FtR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: ['Windblown (FtR)', { card: 'Unsullied', kneeling: true }]
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.windblown);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.windblown);
        this.player1.clickCard(this.unsullied);
    });

    it('returns itself to shadows to stand an Army or Mercenary character after you win a challenge it is participating in', function () {
        expect(this.windblown.location).toBe('shadows');
        expect(this.unsullied.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Windblown (FtR) when it is the only Army or Mercenary to stand', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: ['Windblown (FtR)', 'Hedge Knight']
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.windblown);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
    });

    // Rules FAQ: "Even if Windblown is the only kneeling Army or Mercenary character in play, you
    // can still trigger its reaction... The effect will simply fail to resolve after the costs are
    // paid."
    it('can still be triggered to return it to shadows', function () {
        expect(this.player1).toAllowAbilityTrigger(this.windblown);

        this.player1.triggerAbility(this.windblown);

        expect(this.windblown.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
