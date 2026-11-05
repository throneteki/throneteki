describe('Mace Tyrell (HoT)', function () {
    function setup(context, opponentPlot) {
        context.setupTest({
            phase: 'plot',
            player1: { inPlay: ['Mace Tyrell (HoT)'], hand: ['Left'] },
            player2: { plotDeck: [opponentPlot] }
        });
        context.player1.selectPlot('Filler Plot');
        context.player2.selectPlot(opponentPlot);
        context.selectFirstPlayer(context.player1);
        context.player1.clickCard(context.left);
    }

    describe('after a tyrell character enters play under your control', function () {
        beforeEach(function () {
            setup(this, 'Filler Plot');
            this.goldBefore = this.player1Object.gold;
        });

        it('pays 1 gold to have Mace Tyrell gain 1 power', function () {
            this.player1.triggerAbility(this.maceTyrell);

            expect(this.maceTyrell.power).toBe(1);
            expect(this.player1Object.gold).toBe(this.goldBefore - 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when removing a character from the game', function () {
        beforeEach(function () {
            setup(this, 'Filler Plot');
            this.player1.clickPrompt('Pass');
            this.player1.clickMenu(this.maceTyrell, 'Remove character from game');
            this.player1.clickCard(this.left);
        });

        it('kneels your faction card to remove it until the beginning of the next phase', function () {
            expect(this.left.location).toBe('out of game');
            expect(this.player1Object.faction.kneeled).toBe(true);

            this.completeMarshalPhase();
            this.player1.clickPrompt('Pass');

            expect(this.left.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    // Ruling: http://www.cardgamedb.com/forums/index.php?/topic/36886-mace-tyrell/
    describe('vs Barring the Gates', function () {
        beforeEach(function () {
            setup(this, 'Barring the Gates');
            this.player1.clickPrompt('Pass');
            this.player1.clickMenu(this.maceTyrell, 'Remove character from game');
            this.player1.clickCard(this.left);
            this.completeMarshalPhase();
            this.player1.clickPrompt('Pass');
        });

        it('still returns the character the following phase', function () {
            expect(this.left.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
