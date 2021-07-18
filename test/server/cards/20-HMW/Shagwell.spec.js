describe('Shagwell', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('tyrell', [
                'A Mummer\'s Farce',
                'Late Summer Feast', 'Shagwell', 'Jinglebell', 'Maester Aemon (Core)', 'Veteran Builder', 'Asha Greyjoy (KotI)'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.shagwell = this.player1.findCardByName('Shagwell');
            this.jinglebell = this.player1.findCardByName('Jinglebell');
            this.noAttach = this.player1.findCardByName('Maester Aemon');
            this.noAttachExcept = this.player1.findCardByName('Veteran Builder');
            this.stealthAndPillage = this.player1.findCardByName('Asha Greyjoy');

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('when shagwell is in play', function() {
            beforeEach(function() {
                this.player1.clickCard(this.shagwell);
                this.player1.clickPrompt('1');
            });

            it('should copy the keywords of a no attachment character', function() {
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('No Attachments')).toBe(false);
                this.player1.dragCard(this.noAttach, 'play area');
                this.noAttach.modifyToken('gold', 1);
                //update state
                this.player1.clickCard(this.shagwell);
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('No Attachments')).toBe(true);
            });

            it('should copy the keywords of a no attachment except weapon character', function() {
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('no attachments except <i>weapon</i>')).toBe(false);
                this.player1.dragCard(this.noAttachExcept, 'play area');
                this.noAttachExcept.modifyToken('gold', 1);
                //update state
                this.player1.clickCard(this.shagwell);
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('no attachments except <i>weapon</i>')).toBe(true);
            });

            it('should copy the keywords of a pillage and stealth character', function() {
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('pillage')).toBe(false);
                expect(this.shagwell.keywords.contains('stealth')).toBe(false);
                this.player1.dragCard(this.stealthAndPillage, 'play area');
                this.stealthAndPillage.modifyToken('gold', 1);
                //update state
                this.player1.clickCard(this.shagwell);
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('pillage')).toBe(true);
                expect(this.shagwell.keywords.contains('stealth')).toBe(true);
            });

            it('should not copy the keywords of a character that left play while another fool with gold is in play', function() {
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('pillage')).toBe(false);
                expect(this.shagwell.keywords.contains('stealth')).toBe(false);
                this.player1.dragCard(this.stealthAndPillage, 'play area');
                this.stealthAndPillage.modifyToken('gold', 1);
                //update state
                this.player1.clickCard(this.shagwell);
                this.player1.dragCard(this.jinglebell, 'play area');
                this.jinglebell.modifyToken('gold', 1);
                //update state
                this.player1.clickCard(this.shagwell);
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('pillage')).toBe(true);
                expect(this.shagwell.keywords.contains('stealth')).toBe(true);
                expect(this.jinglebell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.jinglebell.keywords.contains('pillage')).toBe(true);
                expect(this.jinglebell.keywords.contains('stealth')).toBe(true);
                //source of pillage and stealth leaves play
                this.player1.dragCard(this.stealthAndPillage, 'discard pile');
                //update state
                this.player1.clickCard(this.shagwell);
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('pillage')).toBe(false);
                expect(this.shagwell.keywords.contains('stealth')).toBe(false);
                expect(this.jinglebell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.jinglebell.keywords.contains('pillage')).toBe(false);
                expect(this.jinglebell.keywords.contains('stealth')).toBe(false);
            });
        });
    });
});
