describe('Balon Greyjoy (KotI)', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('greyjoy', [
                'Marching Orders',
                'Balon Greyjoy (KotI)', 'Hedge Knight', 'Dragonstone Faithful', 'Iron Islands Fishmonger'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.balon = this.player1.findCardByName('Balon Greyjoy');
            this.targetCharacter = this.player2.findCardByName('Hedge Knight');
            this.chud1 = this.player2.findCardByName('Dragonstone Faithful');
            this.chud2 = this.player2.findCardByName('Iron Islands Fishmonger');

            this.player1.clickCard(this.balon);
            this.player2.dragCard(this.targetCharacter, 'discard pile');

            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();

            this.player2.dragCard(this.chud1, 'draw deck');
            this.player2.dragCard(this.chud2, 'draw deck');
        });

        describe('when using Balon´s ability', function() {
            beforeEach(function() {
                expect(this.targetCharacter.location).toBe('discard pile');
                this.player1.clickMenu(this.balon, 'Put card into play');
                this.player1.clickCard(this.targetCharacter);
            });

            it('puts the target into play under your control', function() {
                expect(this.targetCharacter.location).toBe('play area');
                expect(this.targetCharacter.controller).toBe(this.player1Object);
            });

            for(let i = 0; i < 100; i++) {
                it('returns the target to the draw deck at the end of the phase and shuffles the deck', function() {
                    this.completeChallengesPhase();
                    expect(this.targetCharacter.location).toBe('draw deck');
                    //TODO this should not be true 100% of the time!
                    expect(this.player2Object.drawDeck[0] === this.targetCharacter).toBe(true);
                });
            }            
        });
    });
});
