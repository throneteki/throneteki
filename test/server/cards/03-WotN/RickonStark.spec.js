describe('Rickon Stark', function () {
    describe('when a normal search would be triggered', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plotDeck: ['Here to Serve'],
                    inPlay: ['Rickon Stark'],
                    deck: ['Maester Aemon (Core)']
                },
                player2: { plotDeck: ['Here to Serve'], deck: ['Maester Aemon (Core)'] }
            });
        });

        it("sacrifices himself to cancel an opponent's search", function () {
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Here to Serve');
            this.selectFirstPlayer(this.player1);

            expect(this.player1).toAllowAbilityTrigger(this.rickonStark);
            this.player1.triggerAbility(this.rickonStark);

            expect(this.rickonStark.location).toBe('discard pile');
            expect(this.player2.findCardByName('Maester Aemon').location).not.toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can cancel your own search', function () {
            this.player1.selectPlot('Here to Serve');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);

            expect(this.player1).toAllowAbilityTrigger(this.rickonStark);
        });
    });

    describe('when an ability has search under a choice or Then', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: { inPlay: ['Rickon Stark'] },
                player2: { agenda: 'Sea of Blood (KotI)', inPlay: ['Balon Greyjoy (Core)'] }
            });
            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.balonGreyjoy);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.triggerAbility(this.seaOfBlood);
        });

        it('cancels the full ability before the choice or Then', function () {
            expect(this.player1).toAllowAbilityTrigger(this.rickonStark);

            this.player1.triggerAbility(this.rickonStark);

            expect(this.player2Object.faction.kneeled).toBe(true);
            expect(this.seaOfBlood.hasToken('blood')).toBe(false);
        });
    });

    describe('when a keyword triggers on a card with the word search in it', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: { inPlay: ['Rickon Stark'] },
                player2: { inPlay: ["Euron Crow's Eye (KotI)"] }
            });
            this.player2.clickPrompt('Power');
            this.player2.clickCard(this.euronCrowsEye);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.rickonStark);
        });

        it('does not let Rickon cancel it', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.rickonStark);
            expect(this.rickonStark.kneeled).toBe(true);
        });
    });
});

describe('Rickon Stark against a card with search in only one of its abilities', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Rickon Stark'] },
            player2: {
                agenda: { card: 'Sea of Blood (R)', tokens: { blood: 1 } },
                inPlay: ['Balon Greyjoy (Core)']
            }
        });
    });

    it('cannot cancel the ability without the word search', function () {
        this.player2.clickCard(this.seaOfBlood);

        expect(this.player1).not.toAllowAbilityTrigger(this.rickonStark);
        expect(this.seaOfBlood.hasToken('blood')).toBe(false);
        expect(this.rickonStark.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });

    it('can cancel the ability with the word search', function () {
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.balonGreyjoy);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.triggerAbility(this.seaOfBlood);

        expect(this.player1).toAllowAbilityTrigger(this.rickonStark);

        this.player1.triggerAbility(this.rickonStark);

        expect(this.rickonStark.location).toBe('discard pile');
        expect(this.seaOfBlood.tokens.blood).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
