const {Tokens} = require('../../../../server/game/Constants');

describe('Haldon Halfmaester', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('tyrell', [
                'Marching Orders',
                'Haldon Halfmaester', 'Aegon Targaryen (TSC)', 'Bribery (R)', 'Hedge Knight', 'Hedge Knight'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.haldon = this.player1.findCardByName('Haldon Halfmaester');
            this.aegon = this.player1.findCardByName('Aegon Targaryen (TSC)');
            [this.hedge1, this.hedge2] = this.player1.filterCardsByName('Hedge Knight', 'hand');
            this.event = this.player1.findCardByName('Bribery');
            this.player1.clickCard(this.hedge1);
            this.player1.clickCard(this.haldon);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
        });

        describe('after you win a challenge with Haldon Halfmaester', function() {
            beforeEach(function() {
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.haldon);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
            });

            describe('and the top card is a character', function() {
                beforeEach(function() {
                    this.player1.dragCard(this.hedge2, 'draw deck');
                    expect(this.hedge2.location).toBe('draw deck');
                    this.skipActionWindow();
                });

                it('it should place 1 gold on a character', function() {
                    expect(this.player1).toHavePrompt('Any reactions?');
                    this.player1.clickCard(this.haldon);
                    expect(this.player1).toHavePrompt('Select card to gain 1 gold');
                    expect(this.hedge1.hasToken(Tokens.gold)).toBe(false);
                    this.player1.clickCard(this.hedge1);
                    expect(this.hedge1.hasToken(Tokens.gold)).toBe(true);
                });
            });

            describe('and the top card is an event', function() {
                beforeEach(function() {
                    this.player1.dragCard(this.event, 'draw deck');
                    expect(this.event.location).toBe('draw deck');
                    this.skipActionWindow();
                });

                it('it should draw the event', function() {
                    expect(this.player1).toHavePrompt('Any reactions?');
                    this.player1.clickCard(this.haldon);
                    expect(this.event.location).toBe('hand');
                });
            });

            describe('and the top card is a Aegon Targaryen', function() {
                beforeEach(function() {
                    this.player1.dragCard(this.aegon, 'draw deck');
                    expect(this.aegon.location).toBe('draw deck');
                    this.skipActionWindow();
                });

                it('it should place 1 gold on a character', function() {
                    expect(this.player1).toHavePrompt('Any reactions?');
                    this.player1.clickCard(this.haldon);
                    expect(this.player1).toHavePrompt('Select card to gain 1 gold');
                    expect(this.hedge1.hasToken(Tokens.gold)).toBe(false);
                    this.player1.clickCard(this.hedge1);
                    expect(this.hedge1.hasToken(Tokens.gold)).toBe(true);
                    expect(this.aegon.location).toBe('play area');
                });
            });
        });
    });
});
