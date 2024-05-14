describe('Shagwell', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                "A Mummer's Farce",
                'Late Summer Feast',
                'Shagwell',
                'Jinglebell',
                'Maester Aemon (Core)',
                'Veteran Builder',
                'Asha Greyjoy (KotI)',
                'Polliver',
                'Patchface',
                'Saltcliffe Sailor'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.shagwell = this.player1.findCardByName('Shagwell');
            this.jinglebell = this.player1.findCardByName('Jinglebell');
            this.patchface = this.player1.findCardByName('Patchface');
            this.noAttach = this.player1.findCardByName('Maester Aemon');
            this.noAttachExcept = this.player1.findCardByName('Veteran Builder');
            this.stealthAndPillage = this.player1.findCardByName('Asha Greyjoy');
            this.pillage = this.player1.findCardByName('Polliver');
            this.stealthGaining = this.player1.findCardByName('Saltcliffe Sailor');

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('when shagwell is alone in play', function () {
            beforeEach(function () {
                this.player1.clickCard(this.shagwell);
                this.player1.clickPrompt('Done');
            });

            it('should copy his own keywords', function () {
                expect(this.shagwell.keywords.getCount('Bestow (1)')).toBe(1);
                this.shagwell.modifyToken('gold', 1);
                //update state
                this.player1.clickCard(this.shagwell);
                expect(this.shagwell.keywords.getCount('Bestow (1)')).toBe(2);
            });
        });

        describe('when shagwell is in play', function () {
            beforeEach(function () {
                this.player1.clickCard(this.shagwell);
                this.player1.clickPrompt('1');
            });

            it('should copy the keywords of a no attachment character', function () {
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('No Attachments')).toBe(false);
                this.player1.dragCard(this.noAttach, 'play area');
                this.noAttach.modifyToken('gold', 1);
                //update state
                this.player1.clickCard(this.shagwell);
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('No Attachments')).toBe(true);
            });

            it('should copy the keywords of a no attachment except weapon character', function () {
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('no attachments except <i>weapon</i>')).toBe(
                    false
                );
                this.player1.dragCard(this.noAttachExcept, 'play area');
                this.noAttachExcept.modifyToken('gold', 1);
                //update state
                this.player1.clickCard(this.shagwell);
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('no attachments except <i>weapon</i>')).toBe(
                    true
                );
            });

            it('should copy the keywords of a pillage and stealth character', function () {
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

            it('should only copy one instance of the same keyword whilst on different characters', function () {
                expect(this.shagwell.keywords.getCount('Bestow (1)')).toBe(2);
                expect(this.shagwell.keywords.getCount('pillage')).toBe(0);

                this.player1.dragCard(this.stealthAndPillage, 'play area');
                this.stealthAndPillage.modifyToken('gold', 1);
                //update state
                this.player1.clickCard(this.shagwell);
                expect(this.shagwell.keywords.getCount('Bestow (1)')).toBe(2);
                expect(this.shagwell.keywords.getCount('pillage')).toBe(1);

                this.player1.dragCard(this.pillage, 'play area');
                this.pillage.modifyToken('gold', 1);
                //update state
                this.player1.clickCard(this.shagwell);
                expect(this.shagwell.keywords.getCount('Bestow (1)')).toBe(2);
                expect(this.shagwell.keywords.getCount('pillage')).toBe(1);
            });

            it('should not copy the keywords of a character that left play while another fool with gold is in play', function () {
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

            it('should not copy the keywords of a character which were also copied from a separate character that left play', function () {
                expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                expect(this.shagwell.keywords.contains('pillage')).toBe(false);
                expect(this.shagwell.keywords.contains('stealth')).toBe(false);
            });

            describe('and patchface is in play', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.patchface);
                    this.player1.clickPrompt('1');
                });

                it("should not copy patchface's keywords when the source of those keywords has left play", function () {
                    expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                    expect(this.patchface.keywords.contains('Bestow (1)')).toBe(true);
                    expect(this.shagwell.keywords.contains('Bestow (3)')).toBe(false);
                    expect(this.patchface.keywords.contains('Bestow (3)')).toBe(false);
                    expect(this.shagwell.keywords.contains('stealth')).toBe(false);
                    expect(this.patchface.keywords.contains('stealth')).toBe(false);
                    //source of stealth gaining ability enters play
                    this.player1.dragCard(this.stealthGaining, 'play area');
                    this.player1.clickPrompt('1');
                    //update state
                    this.player1.clickCard(this.shagwell);
                    expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                    expect(this.patchface.keywords.contains('Bestow (1)')).toBe(true);
                    expect(this.shagwell.keywords.contains('Bestow (3)')).toBe(true);
                    expect(this.patchface.keywords.contains('Bestow (3)')).toBe(true);
                    expect(this.shagwell.keywords.contains('stealth')).toBe(true);
                    expect(this.patchface.keywords.contains('stealth')).toBe(true);
                    //source of stealth gaining ability leaves play
                    this.player1.dragCard(this.stealthGaining, 'discard pile');
                    //update state
                    this.player1.clickCard(this.shagwell);
                    expect(this.shagwell.keywords.contains('Bestow (1)')).toBe(true);
                    expect(this.patchface.keywords.contains('Bestow (1)')).toBe(true);
                    expect(this.shagwell.keywords.contains('Bestow (3)')).toBe(false);
                    expect(this.patchface.keywords.contains('Bestow (3)')).toBe(false);
                    expect(this.shagwell.keywords.contains('stealth')).toBe(false);
                    expect(this.patchface.keywords.contains('stealth')).toBe(false);
                });
            });
        });
    });
});
