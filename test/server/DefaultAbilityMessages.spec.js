describe('default ability messages', function () {
    function lastMessages(game, count) {
        return game
            .getPlainTextLog()
            .split('\n')
            .filter((line) => line)
            .slice(-count)
            .join('\n');
    }

    describe('for an ability whose cost is paid with its own card', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Old Gate', 'Winterfell Steward'] }
            });

            this.player1.clickMenu(this.oldGate, 'Sacrifice to draw 2 cards');
        });

        it('describes the cost and what resolved', function () {
            expect(lastMessages(this.game, 1)).toContain(
                'player1 sacrifices Old Gate and draws 2 cards'
            );
            expect(this.player1Object.hand).toHaveLength(2);
        });
    });

    describe('when the ability is cancelled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Old Gate', 'Winterfell Steward'] },
                player2: { faction: 'lannister', inPlay: ["King's Landing Septon"] }
            });

            this.player1.clickMenu(this.oldGate, 'Sacrifice to draw 2 cards');
            this.player2.triggerAbility(this.kingsLandingSepton);
        });

        it('only logs that it was used', function () {
            const messages = lastMessages(this.game, 2);

            expect(messages.split('\n').map((line) => line.slice(20))).toContain(
                'player1 uses Old Gate'
            );
            expect(messages).not.toContain('draws 2 cards');
            expect(this.player1Object.hand).toHaveLength(0);
        });
    });

    describe('for an ability whose game action logs its own message', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'martell',
                    agenda: 'Fealty',
                    inPlay: ['Alleras the Sphinx']
                },
                player2: { inPlay: ['House Dayne Knight', 'Silent Sisters'] }
            });

            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.allerasTheSphinx);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.houseDayneKnight);
            this.player2.clickCard(this.silentSisters);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.triggerAbility(this.allerasTheSphinx);
            this.player1.clickCard(this.player1Object.drawDeck[0]);
        });

        it('does not add a default message', function () {
            expect(lastMessages(this.game, 5)).not.toContain('player1 uses Alleras the Sphinx and');
        });
    });
});
