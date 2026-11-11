describe("Storm's End (BtB)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: ["Storm's End (BtB)", 'Fiery Followers', 'Hedge Knight']
            },
            player2: { faction: 'baratheon', inPlay: ['Scheming Septon'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.fieryFollowers);
        this.player1.clickPrompt('Done');
    });

    it('keeps the initiated and current challenge types as military until triggered', function () {
        expect(this.game.currentChallenge.initiatedChallengeType).toBe('military');
        expect(this.game.currentChallenge.challengeType).toBe('military');
        expect(this.player1).toAllowAbilityTrigger(this.stormsEnd);
    });

    describe('when triggered', function () {
        beforeEach(function () {
            this.player1.triggerAbility(this.stormsEnd);
            this.skipActionWindow();
        });

        it('kneels to change the challenge type to power, keeping the initiated type', function () {
            expect(this.stormsEnd.kneeled).toBe(true);
            expect(this.game.currentChallenge.initiatedChallengeType).toBe('military');
            expect(this.game.currentChallenge.challengeType).toBe('power');
        });

        it('lets characters with a power icon defend', function () {
            this.player2.clickCard(this.schemingSepton);
            this.player2.clickPrompt('Done');
            expect(this.game.currentChallenge.defenders).toContain(this.schemingSepton);
        });
    });

    it('stops characters without a power icon standing during the challenges phase', function () {
        expect(this.hedgeKnight.allowGameAction('stand')).toBe(false);
        expect(this.schemingSepton.allowGameAction('stand')).toBe(true);
    });
});
