describe("Valyrian's Crew", function () {
    beforeAll(function () {
        this.setupTopCardUnderCrew = function (cardName) {
            const deck1 = this.buildDeck('baratheon', [
                'Trading with the Pentoshi',
                'A Noble Cause',
                'A Noble Cause',
                "Valyrian's Crew",
                'Dragonstone Faithful'
            ]);
            const deck2 = this.buildDeck('stark', [
                'Trading with the Pentoshi',
                'A Noble Cause',
                'Blood of the Dragon',
                { name: cardName, count: 12 }
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.crew = this.player1.findCardByName("Valyrian's Crew", 'hand');

            this.player1.clickCard(this.crew);

            this.completeSetup();

            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);
            this.completeMarshalPhase();

            // 1 or more cards required in deck to trigger any search effects (such as Olenna's Cunning)
            this.faithful = this.player1.findCardByName('Dragonstone Faithful', 'hand');
            this.player1.dragCard(this.faithful, 'draw deck');

            this.topCard = this.player2Object.drawDeck[0];

            // Win a challenge
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.crew);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();

            // Trigger the ability
            this.player1.triggerAbility(this.crew);
        };
    });

    integration(function () {
        describe('when winning a challenge', function () {
            beforeEach(function () {
                this.setupTopCardUnderCrew('Arya Stark (Core)');
            });

            it('should add the top card as a facedown attachment', function () {
                expect(this.crew.attachments).toContain(this.topCard);
                expect(this.topCard.facedown).toBe(true);
                expect(this.topCard).toBeControlledBy(this.player1);
                expect(this.topCard.getType()).toBe('attachment');
                expect(this.topCard.isTerminal()).toBe(true);
            });

            describe('and the stealing player tries to marshal it', function () {
                beforeEach(function () {
                    // Skip claim from challenge
                    this.player1.clickPrompt('Continue');
                    this.completeChallengesPhase();

                    this.player2.discardToReserve();

                    this.player1.selectPlot('A Noble Cause');
                    this.player2.selectPlot('Blood of the Dragon');
                    this.selectFirstPlayer(this.player1);
                });

                it('should allow the character to be marshalled', function () {
                    this.player1.clickCard(this.topCard);

                    expect(this.player1Object.cardsInPlay).toContain(this.topCard);
                    expect(this.topCard.location).toBe('play area');
                    expect(this.topCard.getType()).toBe('character');
                    expect(this.topCard).toBeControlledBy(this.player1);
                });

                it('should apply effects to the newly marshalled card', function () {
                    this.player1.clickCard(this.topCard);

                    // Printed 2 STR - 1 STR from Blood of the Dragon
                    expect(this.topCard.getStrength()).toBe(1);
                });
            });

            describe('and the opponent tries to marshal a copy of that card', function () {
                beforeEach(function () {
                    // Skip claim from challenge
                    this.player1.clickPrompt('Continue');
                    this.completeChallengesPhase();

                    this.player2.discardToReserve();

                    this.player1.selectPlot('A Noble Cause');
                    this.player2.selectPlot('A Noble Cause');
                    this.selectFirstPlayer(this.player2);

                    this.character = this.player2.findCardByName('Arya Stark', 'hand');

                    this.player2.clickCard(this.character);
                });

                it('should allow the character to be marshalled', function () {
                    // A facedown character is not considered in play, so even
                    // though the opponent controls a copy of the card, because
                    // it isn't in play as that card, it should not prevent the
                    // owner to marshal the character.
                    expect(this.character.location).toBe('play area');
                });
            });
        });

        describe('when attaching a facedown attachment', function () {
            beforeEach(function () {
                this.setupTopCardUnderCrew('Longclaw');
            });

            it('should allow it to be attached regardless of restrictions', function () {
                // Longclaw can normally only be attached to a Night's Watch
                // character, but while facedown does not have such a restriction
                expect(this.crew.attachments).toContain(this.topCard);
            });

            it('should not grant effects that attachment normally grants', function () {
                expect(this.crew.getStrength()).toBe(this.crew.getPrintedStrength());
            });
        });

        describe("when there's a valid facedown attachment", function () {
            beforeEach(function () {
                this.setupTopCardUnderCrew('Noble Lineage');

                // Skip claim
                this.player1.clickPrompt('Continue');

                this.completeChallengesPhase();
                this.player2.discardToReserve();

                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);
            });

            it('should allow it to be marshalled', function () {
                this.player1.clickCard(this.topCard);
                this.player1.clickCard(this.crew);

                expect(this.topCard.facedown).toBe(false);
                expect(this.crew.attachments).toContain(this.topCard);
                expect(this.crew.hasIcon('power')).toBe(true);
            });
        });

        describe("when there's an action-based event", function () {
            beforeEach(function () {
                this.setupTopCardUnderCrew('Nightmares');

                // Skip claim
                this.player1.clickPrompt('Continue');
            });

            it('should allow it to be played', function () {
                this.player1.clickCard(this.topCard);
                this.player1.clickCard(this.crew);

                expect(this.crew.isAnyBlank()).toBe(true);
            });
        });

        describe("when there's a triggered event", function () {
            beforeEach(function () {
                this.setupTopCardUnderCrew("Olenna's Cunning");
            });

            it('should allow it to be played', function () {
                expect(this.player1).toAllowAbilityTrigger(this.topCard);
            });
        });
    });
});
