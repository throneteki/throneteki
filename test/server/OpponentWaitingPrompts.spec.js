describe("what an opponent sees while a player hasn't committed to anything", function () {
    function rawClick(context, card) {
        context.game.cardClicked(context.player1.name, card.uuid);
        context.game.continue();
    }

    describe('while a player confirms a card action', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Gates of Winterfell']
                }
            });

            this.opponentPrompt = this.player2.formatPrompt();
            rawClick(this, this.gatesOfWinterfell);
        });

        it('leaves their prompt as it was', function () {
            expect(this.player1).toHavePrompt('Use Gates of Winterfell?');
            expect(this.player2.formatPrompt()).toBe(this.opponentPrompt);

            this.player1.clickPrompt('Cancel');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while a player chooses how to play a card', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    gold: 5,
                    hand: ['Black Market Merchant']
                }
            });

            this.opponentPrompt = this.player2.formatPrompt();
            rawClick(this, this.blackMarketMerchant);
        });

        it('leaves their prompt as it was', function () {
            expect(this.player1).toHavePromptButton('Marshal into shadows');
            expect(this.player2.formatPrompt()).toBe(this.opponentPrompt);

            this.player1.clickPrompt('Marshal');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while a player chooses attackers', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Hedge Knight']
                },
                player2: {
                    inPlay: ['House Maester']
                }
            });

            this.player1.clickPrompt('Military');
        });

        it('shows them the attacker is still deciding on a challenge', function () {
            expect(this.player1).toHavePrompt('Select challenge attackers');
            expect(this.player2).toHavePrompt('Waiting for opponent to initiate challenge');
        });

        it('shows them the challenge once attackers are declared', function () {
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();

            expect(this.player2).toHavePrompt('Select defenders');
        });
    });
});
