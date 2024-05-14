describe('Orton Merryweather', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'Marching Orders',
                'Orton Merryweather',
                'Hightower Spy',
                'Hedge Knight',
                'Growing Strong'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.orton = this.player1.findCardByName('Orton Merryweather');
            this.spy = this.player1.findCardByName('Hightower Spy');
            this.event = this.player1.findCardByName('Growing Strong');
            this.nonspy = this.player1.findCardByName('Hedge Knight');
            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.player1.dragCard(this.event, 'discard pile');
        });

        describe('after a small council card enters play', function () {
            beforeEach(function () {
                expect(this.event.location).toBe('discard pile');
                //marshal
                this.player1.clickCard(this.orton);
            });

            it('it should return an event from the discard pile to hand', function () {
                //trigger reaction
                this.player1.clickCard(this.orton);
                expect(this.player1).toHavePrompt('Select an event');
                this.player1.clickCard(this.event);
                expect(this.event.location).toBe('hand');
            });

            describe('after Orton Merryweather leaves play', function () {
                beforeEach(function () {
                    //marshal
                    this.player1.clickCard(this.orton);
                    //trigger reaction
                    this.player1.clickCard(this.orton);
                    this.player1.clickCard(this.event);
                });

                it('it should ask to put a Spy into play', function () {
                    this.completeMarshalPhase();
                    expect(this.spy.location).toBe('hand');
                    expect(this.nonspy.location).toBe('hand');
                    this.player1.dragCard(this.orton, 'discard pile');
                    this.player1.clickCard(this.orton);
                    expect(this.player1).toHavePrompt('Select a character');
                    this.player1.clickCard(this.nonspy);
                    expect(this.nonspy.location).toBe('hand');
                    this.player1.clickCard(this.spy);
                    expect(this.spy.location).toBe('play area');
                });
            });
        });
    });
});
