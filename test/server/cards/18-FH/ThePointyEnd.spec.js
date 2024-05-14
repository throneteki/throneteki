describe('The Pointy End', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'The Pointy End',
                'Ygritte',
                'Ygritte',
                'Noble Lineage',
                'Noble Lineage',
                'Hedge Knight'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            [this.ygritte1, this.ygritte2] = this.player1.filterCardsByName('Ygritte', 'hand');
            [this.attachment1, this.attachment2] = this.player1.filterCardsByName(
                'Noble Lineage',
                'hand'
            );
            this.hedge = this.player1.findCardByName('Hedge Knight');
            this.player1.clickCard(this.ygritte1);
            this.player1.clickCard(this.ygritte2);
            this.player1.clickCard(this.hedge);
            this.player1.clickCard(this.attachment1);
            this.player1.clickCard(this.attachment2);
            this.completeSetup();
            this.ygritte1.modifyPower(3);
            this.hedge.modifyPower(3);
            this.player1.clickCard(this.attachment1);
            this.player1.clickCard(this.hedge);
            this.player1.clickCard(this.attachment2);
            this.player1.clickCard(this.hedge);
            expect(this.ygritte1.dupes.length).toBe(1);
            expect(this.ygritte2.location).toBe('duplicate');
            expect(this.hedge.attachments.length).toBe(2);
            expect(this.ygritte1.getPower()).toBe(3);
            expect(this.hedge.getPower()).toBe(3);

            this.selectFirstPlayer(this.player1);
            this.player1.clickPrompt('player1 - The Pointy End');
        });

        describe('after The Pointy End is revealed', function () {
            it('it should ask the player to choose a character and discard each power and dupe from it', function () {
                expect(this.player1).toHavePrompt('Select a character');
                this.player1.clickCard(this.ygritte1);
                expect(this.ygritte1.dupes.length).toBe(0);
                expect(this.ygritte2.location).toBe('discard pile');
                expect(this.ygritte1.getPower()).toBe(0);
            });

            it('it should ask the player to choose a character and discard each attachment from it', function () {
                expect(this.player1).toHavePrompt('Select a character');
                this.player1.clickCard(this.hedge);
                expect(this.hedge.attachments.length).toBe(0);
                expect(this.hedge.getPower()).toBe(3);
            });
        });
    });
});
