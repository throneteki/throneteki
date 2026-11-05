describe('Leathers', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Leathers'],
                inPlay: ['Young Spearwife', 'Mag the Mighty', 'House Maester'],
                drawDeck: ['Wun Wun', 'Hedge Knight']
            },
            player2: {
                inPlay: ['Young Spearwife', 'Wun Wun']
            }
        });

        this.spearwife = this.player1.findCardByName('Young Spearwife');
        this.opponentSpearwife = this.player2.findCardByName('Young Spearwife');
        this.opponentGiant = this.player2.findCardByName('Wun Wun');
    });

    describe('before he enters play', function () {
        it('does not change Wildling or Giant characters', function () {
            expect(this.spearwife.isFaction('thenightswatch')).toBe(false);
            expect(this.magTheMighty.hasIcon('intrigue')).toBe(false);
            expect(this.opponentSpearwife.isFaction('thenightswatch')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('after he enters play', function () {
        beforeEach(function () {
            this.player1.clickCard(this.leathers);
            this.player1.triggerAbility(this.leathers);
        });

        it('can only find a Giant character', function () {
            expect(this.player1).toBeAbleToSelect(this.wunWun);
            expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).not.toBeAbleToSelect(this.magTheMighty);

            this.player1.clickCard(this.wunWun);

            expect(this.player1).isReadyToTakeAction();
        });

        it('adds the Giant to your hand, and only your Wildling and Giant characters change', function () {
            this.player1.clickCard(this.wunWun);

            expect(this.wunWun.location).toBe('hand');
            expect(this.spearwife.isFaction('thenightswatch')).toBe(true);
            expect(this.magTheMighty.isFaction('thenightswatch')).toBe(true);
            expect(this.magTheMighty.hasIcon('intrigue')).toBe(true);
            expect(this.leathers.hasIcon('intrigue')).toBe(true);
            expect(this.houseMaester.isFaction('thenightswatch')).toBe(false);
            expect(this.houseMaester.hasIcon('military')).toBe(false);
            expect(this.opponentSpearwife.isFaction('thenightswatch')).toBe(false);
            expect(this.opponentGiant.hasIcon('intrigue')).toBe(false);
            expect(this.opponentGiant.isFaction('thenightswatch')).toBe(false);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Leathers to search their deck for a Giant character'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
