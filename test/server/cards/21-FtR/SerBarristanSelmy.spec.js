describe('Ser Barristan Selmy (FtR)', function () {
    it('discards a card after you win a challenge he is in to raise your claim by 1', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Barristan Selmy (FtR)'], hand: ['The Roseroad'] },
            player2: { power: 3 }
        });
        this.unopposedChallenge(this.player1, 'Power', this.serBarristanSelmy);
        this.player1.triggerAbility('Ser Barristan Selmy');
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickPrompt('Raise claim');
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.player2Object.faction.power).toBe(1);
    });

    it('or to stand each defending Knight', function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                inPlay: ['Ser Barristan Selmy (FtR)', 'Hedge Knight'],
                hand: ['The Roseroad']
            },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.serBarristanSelmy);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('Ser Barristan Selmy');
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickPrompt('Stand each defending Knight');
        expect(this.serBarristanSelmy.kneeled).toBe(false);
        expect(this.hedgeKnight.kneeled).toBe(false);
    });
});
