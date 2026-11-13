describe('Casterly Rock (R2)', function () {
    describe('while it is standing', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Casterly Rock (R2)', 'Lannisport Merchant', 'Burned Men'] }
            });
            this.player1.clickMenu(this.casterlyRock, 'Select cards to gain gold');
            this.player1.clickCard(this.lannisportMerchant);
            this.player1.clickCard(this.burnedMen);
            this.player1.clickPrompt('Done');
        });

        it('kneels to have up to 3 cards gain 1 gold each', function () {
            expect(this.lannisportMerchant.gold).toBe(1);
            expect(this.burnedMen.gold).toBe(1);
            expect(this.casterlyRock.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('before it kneels', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Casterly Rock (R2)', { card: 'Lannisport Merchant', gold: 2 }]
                }
            });
        });

        it('lets you spend gold on lannister cards you control', function () {
            expect(this.player1Object.getSpendableGold({ activePlayer: this.player1Object })).toBe(
                this.player1Object.gold + 2
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });
});

describe('Casterly Rock (R2) with the faction card', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'lannister',
                inPlay: ['Casterly Rock (R2)', 'Veteran Builder', 'Lannisport Merchant']
            },
            player2: { faction: 'stark' }
        });
        this.player1.clickMenu(this.casterlyRock, 'Select cards to gain gold');
    });

    it('can choose your faction card to gain 1 gold', function () {
        expect(this.player1).toBeAbleToSelect(this.player1Object.faction);
        expect(this.player1).toBeAbleToSelect(this.lannisportMerchant);
        expect(this.player1).not.toBeAbleToSelect(this.player2Object.faction);
        expect(this.player1).not.toBeAbleToSelect(this.veteranBuilder);
        expect(this.player1).not.toBeAbleToSelect(this.player1Object.activePlot);

        this.player1.clickCard(this.player1Object.faction);
        this.player1.clickPrompt('Done');

        expect(this.player1Object.faction.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('lets you spend gold on your faction card while it is standing', function () {
        this.player1.clickCard(this.player1Object.faction);
        this.player1.clickPrompt('Done');
        this.player1.clickMenu(this.veteranBuilder, 'Stand a location');
        this.player1.clickCard(this.casterlyRock);

        expect(this.casterlyRock.kneeled).toBe(false);
        expect(this.player1Object.getSpendableGold({ activePlayer: this.player1Object })).toBe(
            this.player1Object.gold + 1
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
