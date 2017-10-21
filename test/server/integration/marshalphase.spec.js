describe('marshal phase', function() {
    integration(function() {
        describe('marshaling normal cards', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'Trading with the Pentoshi', 'Sneak Attack',
                    'Arya Stark (Core)', 'Eddard Stark (Core)', 'Eddard Stark (Core)', 'Eddard Stark (WotN)', 'The Kingsroad', 'Hear Me Roar!', 'Gold Cloaks'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.skipSetupPhase();
                this.player1.selectPlot('Trading with the Pentoshi');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                this.arya = this.player1.findCardByName('Arya Stark (Core)');
                [this.ned1, this.ned2] = this.player1.filterCardsByName('Eddard Stark (Core)');
                this.wotnNed = this.player1.findCardByName('Eddard Stark (WotN)');
                this.kingsroad = this.player1.findCardByName('The Kingsroad');
                this.hearMeRoar = this.player1.findCardByName('Hear Me Roar!');
            });

            it('should limit marshaling to the amount of plot gold', function() {
                this.player1.clickCard(this.kingsroad); // 9 remaining
                this.player1.clickCard(this.ned1); // 2 remaining
                this.player1.clickCard(this.arya); // not enough gold

                expect(this.kingsroad.location).toBe('play area');
                expect(this.ned1.location).toBe('play area');
                expect(this.arya.location).toBe('hand');
                expect(this.player1Object.gold).toBe(2);
            });

            it('should trigger any enters play abilities', function() {
                // Ensure there is a card in draw deck
                this.kingsroad.controller.moveCard(this.kingsroad, 'draw deck');
                this.player1.clickCard(this.arya);

                this.player1.clickPrompt('Arya Stark');

                expect(this.arya.dupes.size()).toBe(1);
            });

            it('should allow reducers to reduce cost', function() {
                this.player1.clickCard('The Kingsroad', 'hand');
                this.player1.clickCard('The Kingsroad', 'play area');
                this.player1.clickCard(this.ned1);

                expect(this.ned1.location).toBe('play area');
                expect(this.kingsroad.location).toBe('discard pile');
                expect(this.player1Object.gold).toBe(5);
            });

            it('should allow events to be played', function() {
                this.player1.clickCard(this.hearMeRoar);

                expect(this.hearMeRoar.location).toBe('being played');
            });

            describe('when marshaling dupes', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.ned1);
                });

                it('should allow the same card to be marshalled as a dupe for free', function() {
                    expect(this.player1Object.gold).toBe(3);

                    this.player1.clickCard(this.ned2);

                    expect(this.player1Object.gold).toBe(3);
                    expect(this.player1Object.cardsInPlay.size()).toBe(1);
                    expect(this.ned1.dupes).toContain(this.ned2);
                });

                it('should allow a card with the same name to be marshalled as a dupe for free', function() {
                    expect(this.player1Object.gold).toBe(3);

                    this.player1.clickCard(this.wotnNed);

                    expect(this.player1Object.gold).toBe(3);
                    expect(this.player1Object.cardsInPlay.size()).toBe(1);
                    expect(this.ned1.dupes).toContain(this.wotnNed);
                });
            });
        });

        describe('when a card is limited', function() {
            beforeEach(function() {
                const deck = this.buildDeck('tyrell', ['Sneak Attack', 'The Roseroad', 'The Arbor', 'The Arbor']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.skipSetupPhase();
                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                this.roseroad = this.player1.findCardByName('The Roseroad');
                [this.arbor1, this.arbor2] = this.player1.filterCardsByName('The Arbor');
            });

            it('should not allow more than one limited location to be placed', function() {
                this.player1.clickCard(this.roseroad);
                this.player1.clickCard(this.arbor1);

                expect(this.roseroad.location).toBe('play area');
                expect(this.arbor1.location).toBe('hand');
            });

            it('should not allow duplicates of a single limited location to be placed', function() {
                this.player1.clickCard(this.arbor1);
                this.player1.clickCard(this.arbor2);

                expect(this.arbor1.location).toBe('play area');
                expect(this.arbor2.location).toBe('hand');
            });
        });

        describe('when attachments are marshalled', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', ['Sneak Attack', 'Red God\'s Blessing', 'Dragonstone Faithful']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.skipSetupPhase();
                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                this.character = this.player1.findCardByName('Dragonstone Faithful');
                this.attachment = this.player1.findCardByName('Red God\'s Blessing');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.attachment);
            });

            it('should prompt the user for the attachment target', function() {
                expect(this.player1).toHavePrompt('Select target for attachment');
            });

            describe('when the attachments have been placed', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.character);
                });

                it('should attach to the selected card', function() {
                    expect(this.character.attachments).toContain(this.attachment);
                });

                it('should properly calculate the effects of the attachment', function() {
                    expect(this.character.getStrength()).toBe(2);
                });
            });
        });

        describe('when unique attachments are marshalled on opponent cards', function() {
            beforeEach(function() {
                const deck = this.buildDeck('targaryen', [
                    'Trading with the Pentoshi',
                    'Crown of Gold', 'Crown of Gold', 'Khal Drogo'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.player1Character = this.player1.findCardByName('Khal Drogo', 'hand');
                [this.player1Crown, this.player1CrownDupe] = this.player1.filterCardsByName('Crown of Gold', 'hand');
                this.player2Character = this.player2.findCardByName('Khal Drogo', 'hand');
                this.player2Crown = this.player2.findCardByName('Crown of Gold', 'hand');

                this.player1.clickCard(this.player1Character);
                this.player2.clickCard(this.player2Character);

                this.completeSetup();

                this.player1.selectPlot('Trading with the Pentoshi');
                this.player2.selectPlot('Trading with the Pentoshi');
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                // Player 1 marshals a Crown on player 2's character
                this.player1.clickCard(this.player1Crown);
                this.player1.clickCard(this.player2Character);

                expect(this.player2Character.getStrength()).toBe(1);
            });

            it('should marshal a dupe automatically', function() {
                this.player1.clickCard(this.player1CrownDupe);

                expect(this.player1).not.toHavePrompt('Select target for attachment');
                expect(this.player1Crown.dupes.pluck('uuid')).toContain(this.player1CrownDupe.uuid);
            });

            describe('when the opponent tries to marshal the same attachment', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Done');

                    this.player2.clickCard(this.player2Crown);
                });

                it('should not marshal it as a duplicate for player 1\'s attachment', function() {
                    expect(this.player1Crown.dupes.pluck('uuid')).not.toContain(this.player2Crown.uuid);
                });

                it('should allow it to be marshalled as normal', function() {
                    this.player2.clickCard(this.player1Character);

                    expect(this.player1Character.getStrength()).toBe(1);
                });
            });
        });
    });
});
