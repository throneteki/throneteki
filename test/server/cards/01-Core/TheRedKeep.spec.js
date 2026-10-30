describe('The Red Keep (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Red Keep (Core)', 'Tumblestone Knight'] },
            player2: { hand: ['Nightmares', 'Areo Hotah (Core)'] }
        });
    });

    describe('during a power challenge with a participating character', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
        });

        it('contributes 2 STR', function () {
            expect(this.game.currentChallenge.attackerStrength).toBe(4);

            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();

            expect(this.player1).isReadyToTakeAction();
        });

        it('stops contributing if blanked mid-challenge', function () {
            this.player1.clickPrompt('Pass');
            this.player2.clickCard(this.nightmares);
            this.player2.clickCard(this.theRedKeep);

            expect(this.game.currentChallenge.attackerStrength).toBe(2);
        });

        it('stops contributing if all characters are removed from the challenge', function () {
            this.player1.clickPrompt('Pass');
            this.player2.clickCard(this.areoHotah);
            this.player2.triggerAbility(this.areoHotah);
            this.player2.clickCard(this.tumblestoneKnight);

            expect(this.game.currentChallenge.attackerStrength).toBe(0);
        });
    });

    it('kneels to draw 2 cards when the challenges phase ends if you have not lost a power challenge', function () {
        this.player1.togglePromptedActionWindow('dominance', true);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility(this.theRedKeep);

        expect(this.theRedKeep.kneeled).toBe(true);
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
