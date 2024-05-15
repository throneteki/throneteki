describe('Spare Boot', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('thenightswatch', [
                'Trading with the Pentoshi',
                'Spare Boot',
                'Bran Stark (Core)',
                'Seal of the Hand',
                "Syrio's Training",
                'Little Bird'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.spareBoot = this.player1.findCardByName('Spare Boot', 'hand');
            this.otherCharacter = this.player1.findCardByName('Bran Stark', 'hand');
            this.nonUsableAttachment = this.player1.findCardByName('Seal of the Hand', 'hand');
            this.usableAttachment = this.player1.findCardByName("Syrio's Training", 'hand');
            this.spareBootAttachment = this.player1.findCardByName('Little Bird', 'hand');

            this.player1.clickCard(this.spareBoot);
            this.player1.clickCard(this.otherCharacter);
            this.player1.clickCard(this.nonUsableAttachment);
            this.player1.clickCard(this.usableAttachment);

            this.completeSetup();

            // place attachments
            this.player1.clickCard(this.nonUsableAttachment);
            this.player1.clickCard(this.otherCharacter);
            this.player1.clickCard(this.usableAttachment);
            this.player1.clickCard(this.otherCharacter);

            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.player1.clickCard(this.spareBootAttachment);
            this.player1.clickCard(this.spareBoot);

            this.completeMarshalPhase();
        });

        describe('when the attachment is movable', function () {
            beforeEach(function () {
                this.player1.clickMenu(this.spareBoot, 'Stand and move attachment');
                this.player1.clickCard(this.usableAttachment);
            });

            it('moves the attachment', function () {
                expect(this.usableAttachment.parent).toBe(this.spareBoot);
            });
        });

        describe('when the attachment is not movable but is knelt', function () {
            beforeEach(function () {
                // Manually kneel the attachment
                this.player1.clickCard(this.nonUsableAttachment);

                this.player1.clickMenu(this.spareBoot, 'Stand and move attachment');
            });

            it('allows selection of the non-movable attachment', function () {
                expect(this.player1).toAllowSelect(this.nonUsableAttachment);
            });

            it('stands the attachment', function () {
                this.player1.clickCard(this.nonUsableAttachment);

                expect(this.nonUsableAttachment.kneeled).toBe(false);
            });

            it('does not move the attachment', function () {
                this.player1.clickCard(this.nonUsableAttachment);

                expect(this.nonUsableAttachment.parent).toBe(this.otherCharacter);
            });
        });

        describe('when the attachment is on Spare Boot already but is knelt', function () {
            beforeEach(function () {
                expect(this.spareBootAttachment.kneeled).toBe(false);

                // Manually kneel the attachment
                this.player1.clickCard(this.spareBootAttachment);

                expect(this.spareBootAttachment.kneeled).toBe(true);

                this.player1.clickMenu(this.spareBoot, 'Stand and move attachment');
            });

            it('allows selection of the attachment', function () {
                expect(this.player1).toAllowSelect(this.spareBootAttachment);
            });

            it('stands the attachment', function () {
                this.player1.clickCard(this.spareBootAttachment);

                expect(this.spareBootAttachment.kneeled).toBe(false);
            });

            it('does not move the attachment', function () {
                this.player1.clickCard(this.spareBootAttachment);

                expect(this.spareBootAttachment.parent).toBe(this.spareBoot);
            });
        });
    });
});
