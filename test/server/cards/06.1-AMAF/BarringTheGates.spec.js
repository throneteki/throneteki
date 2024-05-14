describe('Barring the Gates', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('greyjoy', ['Barring the Gates', 'Theon Greyjoy (Core)']);
            const deck2 = this.buildDeck('lannister', [
                'A Noble Cause',
                'Burned Men',
                'Hear Me Roar!',
                'Ward (TS)'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.controllableCharacter = this.player1.findCardByName('Theon Greyjoy', 'hand');
            this.character = this.player2.findCardByName('Burned Men', 'hand');

            this.player1.clickCard(this.controllableCharacter);

            this.completeSetup();

            this.selectFirstPlayer(this.player2);
        });

        it('should not prevent marshalling', function () {
            this.player2.clickCard(this.character);

            expect(this.character.location).toBe('play area');
        });

        it('should not prevent take control', function () {
            let ward = this.player2.findCardByName('Ward', 'hand');
            this.player2.clickCard(ward);
            this.player2.clickCard(this.controllableCharacter);

            expect(this.controllableCharacter.attachments).toContain(ward);
            expect(this.controllableCharacter).toBeControlledBy(this.player2);
        });

        it('should prevent ambush', function () {
            this.completeMarshalPhase();

            this.player2.clickCard(this.character);

            expect(this.character.location).not.toBe('play area');
        });

        it('should prevent putting into play', function () {
            this.completeMarshalPhase();

            this.player2.clickCard('Hear Me Roar!');
            this.player2.clickCard(this.character);

            expect(this.character.location).not.toBe('play area');
        });
    });
});
