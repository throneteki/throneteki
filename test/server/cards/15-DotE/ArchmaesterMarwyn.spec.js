describe('Archmaester Marwyn', function () {
    integration(function () {
        describe('ability', function () {
            beforeEach(function () {
                const deck = this.buildDeck('baratheon', [
                    'The Conclave',
                    'Late Summer Feast',
                    'Archmaester Marwyn',
                    'Archmaester Marwyn',
                    'Shadow Priestess',
                    'Hedge Knight',
                    'Tithe'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                [this.marwyn, this.dupe] = this.player1.filterCardsByName('Archmaester Marwyn');
                this.card = this.player1.findCardByName('Hedge Knight');
                this.shadowCard = this.player1.findCardByName('Shadow Priestess');
                this.event = this.player1.findCardByName('Tithe');

                this.player1.clickCard(this.marwyn);
                // Move the rest of cards under the agenda
                this.player1Object.moveCard(this.dupe, 'conclave');
                this.player1Object.moveCard(this.card, 'conclave');
                this.player1Object.moveCard(this.shadowCard, 'conclave');
                this.player1Object.moveCard(this.event, 'conclave');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);
            });

            describe('when marshalling a card', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.card);
                });

                it('marshals the card', function () {
                    expect(this.card.location).toContain('play area');
                });

                it('counts toward the limit', function () {
                    this.player1.clickCard(this.dupe);

                    expect(this.dupe.location).toEqual('conclave');
                });
            });

            describe('when playing an event', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.event);
                    this.player1.clickCard(this.marwyn);
                });

                it('plays the event', function () {
                    expect(this.event.location).toContain('discard pile');
                });

                it('counts toward the limit', function () {
                    this.player1.clickCard(this.card);

                    expect(this.card.location).toEqual('conclave');
                });
            });

            describe('when marshalling a dupe', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.dupe);
                });

                it('marshals the dupe', function () {
                    expect(this.marwyn.dupes).toContain(this.dupe);
                });

                it('counts toward the limit', function () {
                    this.player1.clickCard(this.card);

                    expect(this.card.location).toEqual('conclave');
                });
            });

            describe('when marshalling into shadows', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.shadowCard);
                    this.player1.clickPrompt('Marshal into shadows');
                });

                it('marshals the card into shadows', function () {
                    expect(this.shadowCard.location).toEqual('shadows');
                });

                it('counts toward the limit', function () {
                    this.player1.clickCard(this.card);

                    expect(this.card.location).toEqual('conclave');
                });
            });
        });
    });
});
