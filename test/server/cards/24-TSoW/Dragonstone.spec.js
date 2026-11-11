describe('Dragonstone (TSoW)', function () {
    beforeEach(function () {
        this.setupTest({
            firstPlayer: 'player2',
            player1: { faction: 'baratheon', inPlay: ['Dragonstone (TSoW)'] },
            player2: {
                shadows: ['Shadow of the Rose'],
                drawDeck: ['Ser Andrey Dalt'],
                gold: 5
            }
        });
        this.player2.clickCard(this.shadowOfTheRose);
        this.player2.clickCard(this.serAndreyDalt);
    });

    it('kneels after a card is placed in shadows by a card effect so that card cannot come out of shadows', function () {
        this.player1.triggerAbility('Dragonstone');
        expect(this.dragonstone.kneeled).toBe(true);
        expect(this.serAndreyDalt.location).toBe('shadows');
        expect(this.player2Object.canPutIntoPlay(this.serAndreyDalt, 'outOfShadows')).toBe(false);
    });

    it('does not stop the card coming out of shadows if declined', function () {
        this.player1.clickPrompt('Pass');
        expect(this.player2Object.canPutIntoPlay(this.serAndreyDalt, 'outOfShadows')).toBe(true);
    });

    it('lets you choose not to stand it during the standing phase', function () {
        this.player1.triggerAbility('Dragonstone');
        this.player2.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.completeChallengesPhase();
        expect(this.player1).toHavePrompt('Select optional cards to stand');
        this.player1.clickPrompt('Done');
        expect(this.dragonstone.kneeled).toBe(true);
    });
});
