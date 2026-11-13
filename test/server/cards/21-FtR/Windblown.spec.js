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

    it('is not offered, since returning it to shadows removes its only target', function () {
        expect(this.player1).not.toAllowAbilityTrigger(this.windblown);
        expect(this.windblown.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
