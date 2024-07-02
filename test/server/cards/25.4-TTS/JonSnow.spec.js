describe('Jon Snow (TTS)', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('stark', [
                'Trading with the Pentoshi',
                'Jon Snow (TTS)',
                'Spearmaiden',
                'Grey Wind (FtR)',
                'Winter Is Coming'
            ]);
            const deck2 = this.buildDeck('baratheon', [
                'Trading with the Pentoshi',
                'Robert Baratheon (Core)',
                'Stannis Baratheon (Core)',
                'Selyse Baratheon (Core)',
                'Mya Stone'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.jon = this.player1.findCardByName('Jon Snow');
            this.spearmaiden = this.player1.findCardByName('Spearmaiden');
            this.greywind = this.player1.findCardByName('Grey Wind (FtR)');
            this.winteriscoming = this.player1.findCardByName('Winter Is Coming');
            this.robert = this.player2.findCardByName('Robert Baratheon');
            this.stannis = this.player2.findCardByName('Stannis Baratheon');
            this.selyse = this.player2.findCardByName('Selyse Baratheon');
            this.mya = this.player2.findCardByName('Mya Stone');

            this.player1.clickCard(this.jon);
            this.player2.clickCard(this.robert);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.player1.clickCard(this.spearmaiden);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.stannis);
            this.player2.clickCard(this.selyse);
            this.player2.clickPrompt('Done');
        });

        describe('when military claim is applied as the attacker', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player1, 'military', this.jon);
                this.player1.clickPrompt('Apply Claim');
            });

            it('should allow Jon Snow to trigger', function () {
                expect(this.player1).toAllowAbilityTrigger(this.jon);
            });
        });

        describe('when military claim is applied as the defender', function () {
            beforeEach(function () {
                // Pass challenges
                this.player1.clickPrompt('Done');
                this.unopposedChallenge(this.player2, 'military', this.robert);
                this.player2.clickPrompt('Apply Claim');
            });

            it('should allow Jon Snow to trigger', function () {
                expect(this.player1).toAllowAbilityTrigger(this.jon);
            });
        });

        describe('when there is 1 character kneeling', function () {
            beforeEach(function () {
                // Kneel robert
                this.player2.clickCard(this.robert);
            });

            describe('and a military claim of 1 is applied', function () {
                beforeEach(function () {
                    // Player 1's claim is already 1
                    this.unopposedChallenge(this.player1, 'military', this.jon);
                    this.player1.clickPrompt('Apply Claim');
                });

                describe('and Jon triggers on kneeling characters', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.jon);
                        this.player1.clickPrompt('Kneeling Characters');
                    });

                    it('should force that kneeling character to be chosen for claim', function () {
                        expect(this.player2).toAllowSelect(this.robert);
                        expect(this.player2).not.toAllowSelect(this.stannis);
                        expect(this.player2).not.toAllowSelect(this.selyse);
                    });
                });

                describe('and Jon triggers on standing characters', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.jon);
                        this.player1.clickPrompt('Standing Characters');
                    });

                    it('should prevent that kneeling character from being chosen for claim', function () {
                        expect(this.player2).not.toAllowSelect(this.robert);
                        expect(this.player2).toAllowSelect(this.stannis);
                        expect(this.player2).toAllowSelect(this.selyse);
                    });
                });
            });

            describe('and Spearmaiden chooses a standing character', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('military');
                    this.player1.clickCard(this.jon);
                    this.player1.clickCard(this.spearmaiden);
                    this.player1.clickPrompt('Done');
                    // Choose Stannis for Spearmaiden ability
                    this.player1.clickCard(this.spearmaiden);
                    this.player1.clickCard(this.stannis);

                    this.skipActionWindow();

                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player1.clickPrompt('Apply Claim');
                });

                describe('and Jon triggers on kneeling characters', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.jon);
                        this.player1.clickPrompt('Kneeling Characters');
                    });

                    it('should allow the defender to choose between the kneeling character, and the character chosen by Spearmaiden', function () {
                        expect(this.player2).toAllowSelect(this.robert);
                        expect(this.player2).toAllowSelect(this.stannis);
                        expect(this.player2).not.toAllowSelect(this.selyse);
                    });
                });
            });

            describe('and a military claim of 2 is applied', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('military');
                    this.player1.clickCard(this.jon);
                    this.player1.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player2.clickPrompt('Done');

                    // Raise claim to 2
                    this.player1.clickCard(this.winteriscoming);
                    this.player2.clickPrompt('Pass');
                    this.player1.clickPrompt('Pass');

                    this.player1.clickPrompt('Apply Claim');
                });

                describe('and Jon triggers on kneeling characters', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.jon);
                        this.player1.clickPrompt('Kneeling Characters');
                    });

                    it('should force that kneeling character to be chosen for claim, and allow 1 standing character be chosen for claim', function () {
                        expect(this.player2).not.toAllowSelect(this.robert);
                        expect(this.player2).toAllowSelect(this.stannis);
                        expect(this.player2).toAllowSelect(this.selyse);
                    });
                });
            });
        });

        describe('when Jon chooses to satisfy claim on standing characters, and one of those characters kneels before claim is chosen', function () {
            beforeEach(function () {
                // Attach grey wind to Jon (to cancel Mya)
                this.player1.dragCard(this.greywind, 'play area');
                this.player1.clickCard(this.jon);
                // Put Mya Stone into play
                this.player2.dragCard(this.mya, 'play area');
                this.player1.clickPrompt('military');
                this.player1.clickCard(this.jon);
                this.player1.clickPrompt('Done');
                // Skip stealth for Jon
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');

                this.player1.clickCard(this.jon);
                this.player1.clickPrompt('Standing Characters');

                // Player 2 attempts to trigger Mya Stone
                this.player2.clickCard(this.mya);
                // Player 1 returns Grey Wind to hand to cancel Mya, leaving claim as military, but she is now kneeling
                this.player1.clickCard(this.greywind);
                this.player1.clickCard(this.greywind);
            });

            it('should allow you to select all standing characters, and that knelt character, for claim', function () {
                expect(this.player2).toAllowSelect(this.robert);
                expect(this.player2).toAllowSelect(this.stannis);
                expect(this.player2).toAllowSelect(this.selyse);
                expect(this.player2).toAllowSelect(this.mya);
            });
        });
    });
});
