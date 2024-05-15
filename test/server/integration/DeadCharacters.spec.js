describe('dead characters', function () {
    integration(function () {
        describe('when playing a dead character', function () {
            beforeEach(function () {
                const deck = this.buildDeck('martell', [
                    'A Noble Cause',
                    'Bran Stark (Core)',
                    'Bran Stark (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                [this.character, this.deadCharacter] = this.player1.filterCardsByName('Bran Stark');

                this.player1.dragCard(this.deadCharacter, 'dead pile');
            });

            it('does not allow the character to enter play', function () {
                this.player1.clickCard(this.character);

                expect(this.character.location).not.toBe('play area');
            });
        });

        describe('when playing a duplicate of a dead character', function () {
            beforeEach(function () {
                const deck = this.buildDeck('martell', [
                    'A Noble Cause',
                    'Bran Stark (Core)',
                    'Bran Stark (Core)',
                    'Bran Stark (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                [this.character, this.dupe, this.deadCharacter] =
                    this.player1.filterCardsByName('Bran Stark');

                this.player1.clickCard(this.character);

                this.player1.dragCard(this.deadCharacter, 'dead pile');
            });

            it('does not allow the duplicate', function () {
                this.player1.clickCard(this.dupe);

                expect(this.character.dupes).not.toContain(this.dupe);
            });
        });

        describe('when playing an attachment has the same name as a dead character', function () {
            beforeEach(function () {
                const deck = this.buildDeck('martell', [
                    'A Noble Cause',
                    'Bran Stark (Core)',
                    'Nymeria (WotN)',
                    'Nymeria (FotOG)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.character = this.player1.findCardByName('Bran Stark');
                this.deadCharacter = this.player1.findCardByName('Nymeria (FotOG)');
                this.attachment = this.player1.findCardByName('Nymeria (WotN)');

                this.player1.dragCard(this.deadCharacter, 'dead pile');
                this.player1.clickCard(this.character);
            });

            it('does not allow the attachment to be attached', function () {
                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);

                expect(this.character.attachments).not.toContain(this.attachment);
            });
        });
    });
});
