describe('Winterfell Crypt', function () {
    function setup(context, bran) {
        context.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Winterfell Crypt', 'Arya Stark (Core)'] },
            player2: { inPlay: ['Castle Guard', bran] }
        });
        context.player1.togglePromptedActionWindow('dominance', true);
        context.unopposedChallenge(context.player2, 'Military', context.castleGuard);
        context.player1.clickCard(context.aryaStark);
    }

    describe('after a unique stark character you control is killed', function () {
        beforeEach(function () {
            setup(this, 'Bran Stark (Core)');
        });

        it('is sacrificed to shuffle a character with equal or lower printed STR into its deck at the end of the phase', function () {
            expect(this.player1).toHavePrompt('Any reactions to Arya Stark being killed?');
            this.player1.clickCard(this.winterfellCrypt);
            expect(this.player1).toHavePrompt('Select a character');
            this.player1.clickCard(this.branStark);

            expect(this.winterfellCrypt.location).toBe('discard pile');

            this.completeChallengesPhase();

            expect(this.branStark.location).toBe('draw deck');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when the chosen character has a dupe', function () {
        beforeEach(function () {
            setup(this, { card: 'Bran Stark (Core)', dupes: 1 });
        });

        it('uses the dupe to save it', function () {
            this.player1.clickCard(this.winterfellCrypt);
            this.player1.clickCard(this.branStark);

            expect(this.branStark.dupes).toHaveLength(1);

            this.completeChallengesPhase();

            expect(this.branStark.location).toBe('play area');
            expect(this.branStark.dupes).toHaveLength(0);
            expect(this.player2Object.discardPile.map((card) => card.name)).toContain('Bran Stark');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
