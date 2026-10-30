describe('clicking cards while a prompt is open', function () {
    function rawClick(context, card) {
        context.game.cardClicked(context.player1.name, card.uuid);
        context.game.continue();
    }

    describe('when the player clicks a card with an action twice', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Gates of Winterfell']
                }
            });

            rawClick(this, this.gatesOfWinterfell);
            rawClick(this, this.gatesOfWinterfell);
        });

        it('asks only once', function () {
            this.player1.clickPrompt('Cancel');

            expect(this.gatesOfWinterfell.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the player clicks a card that can be played more than one way twice', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    gold: 5,
                    hand: ['Black Market Merchant', 'Hedge Knight']
                }
            });

            rawClick(this, this.blackMarketMerchant);
            rawClick(this, this.blackMarketMerchant);
        });

        it('does not play another card clicked before answering', function () {
            rawClick(this, this.hedgeKnight);

            expect(this.hedgeKnight.location).toBe('hand');
            expect(this.player1).toHavePromptButton('Marshal into shadows');
        });

        it('asks only once', function () {
            expect(this.player1).toHavePromptButton('Marshal');
            expect(this.player1).toHavePromptButton('Marshal into shadows');

            this.player1.clickPrompt('Marshal');

            expect(this.blackMarketMerchant.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the player clicks another card while an ability is resolving', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    gold: 5,
                    hand: ['Gifts for the Widow (DitD)', 'Nightmares'],
                    inPlay: ['House Maester'],
                    drawDeck: ['Noble Lineage']
                }
            });

            this.player1.clickCard(this.giftsForTheWidow);
        });

        it('cannot start another action', function () {
            expect(this.player1).toHavePrompt('Select value of X');
            expect(this.player1.actionUnavailableReason(this.nightmares)).toBe('window');

            this.player1.clickCard(this.nightmares);

            expect(this.player1).toHavePrompt('Select value of X');
            expect(this.nightmares.location).toBe('hand');
        });

        it('can start one once it has resolved', function () {
            this.player1.selectValue('1');
            this.player1.clickCard(this.nobleLineage);
            this.player1.clickCard(this.houseMaester);

            expect(this.player1.actionUnavailableReason(this.nightmares)).toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
