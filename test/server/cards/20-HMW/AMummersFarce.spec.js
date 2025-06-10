describe('A Mummer´s Farce', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                "A Mummer's Farce",
                'Late Summer Feast',
                'Jinglebell',
                'Green-Apple Knight',
                'Green-Apple Knight',
                'Warhammer',
                'Blessed by the Maiden'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.jinglebell = this.player1.findCardByName('Jinglebell');
            [this.knight1, this.knight2] = this.player1.filterCardsByName(
                'Green-Apple Knight',
                'hand'
            );
            this.blessed = this.player1.findCardByName('Blessed by the Maiden');
            this.warhammer = this.player1.findCardByName('Warhammer');
            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.player1Object.moveCard(this.knight2, 'draw deck');
        });

        describe('when a card with a persistent effect under a fool gets marshalled', function () {
            beforeEach(function () {
                //put fool and another knight into play
                this.player1.clickCard(this.jinglebell);
                this.player1.clickCard(this.knight1);
            });

            it('the persistent effect of that card should activate once the card enters play', function () {
                expect(this.jinglebell.location).toBe('play area');
                expect(this.knight1.location).toBe('play area');
                expect(this.knight1.getStrength()).toBe(1);
                expect(this.jinglebell.getStrength()).toBe(1);
                expect(this.knight2.location).toBe('draw deck');
                //kneel and stand the fool to trigger A Mummer´s Farce
                this.player1.clickCard(this.jinglebell);
                this.player1.clickCard(this.jinglebell);
                //STR increase from farce
                expect(this.jinglebell.getStrength()).toBe(2);
                expect(this.knight2.parent).toBe(this.jinglebell);
                expect(this.knight2.location).toBe('play area');
                expect(this.knight2.facedown).toBe(true);
                //marshall the knight from under the fool
                this.player1.clickCard(this.knight2);
                expect(this.jinglebell.getStrength()).toBe(1);
                expect(this.knight2.parent).toBe(undefined);
                expect(this.knight2.location).toBe('play area');
                expect(this.knight2.facedown).toBe(false);
                //both knights persistent STR buff effects should work
                expect(this.knight1.getStrength()).toBe(2);
                expect(this.knight2.getStrength()).toBe(2);
            });
        });

        describe('when a fool has a weapon attachment and a facedown attachment attached and gains the no attachments keyword', function () {
            beforeEach(function () {
                this.player1.clickCard(this.jinglebell);
                this.player1.clickCard(this.warhammer);
                this.player1.clickCard(this.jinglebell);
                //kneel and stand the fool to trigger A Mummer´s Farce
                this.player1.clickCard(this.jinglebell);
                this.player1.clickCard(this.jinglebell);
                expect(this.jinglebell.getStrength()).toBe(4);
                this.player1.clickCard(this.blessed);
                this.player1.clickCard(this.jinglebell);
            });

            it('the weapon attachments should be discarded because they are invalidly attached', function () {
                expect(this.jinglebell.location).toBe('play area');
                expect(this.jinglebell.getStrength()).toBe(1);
                expect(this.knight2.location).toBe('discard pile');
                expect(this.warhammer.location).toBe('discard pile');
            });
        });
    });
});
