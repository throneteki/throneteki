describe('We Light the Way', function () {
    it('can kneel either named trait and keeps each granted shadow keyword tied to its own card', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['The Hightower', 'Oldtown (R2)', 'Handmaiden'],
                hand: ['We Light the Way', 'We Light the Way'],
                drawDeck: ['House Maester', 'The Roseroad'],
                gold: 2
            },
            player2: { inPlay: ['The Hightower'] }
        });
        const events = this.player1Object.hand.filter((card) => card.name === 'We Light the Way');
        const enemyTower = this.player2.findCardByName('The Hightower', 'play area');
        this.player1.clickCard(events[0]);
        expect(this.player1).toBeAbleToSelect(this.theHightower);
        expect(this.player1).toBeAbleToSelect(this.oldtown);
        expect(this.player1).not.toBeAbleToSelect(this.handmaiden);
        expect(this.player1).not.toBeAbleToSelect(enemyTower);
        this.player1.clickCard(this.theHightower);
        expect(this.houseMaester.location).toBe('shadows');
        expect(this.houseMaester.tokens.shadow).toBe(1);
        expect(this.game.cardVisibility.isVisible(this.houseMaester, this.player2Object)).toBe(
            false
        );
        this.player1.clickCard(events[1]);
        this.player1.clickCard(this.oldtown);
        expect(this.theRoseroad.location).toBe('shadows');
        expect(this.theRoseroad.getShadowCost()).toBe(0);
        this.player1.clickCard(this.houseMaester);
        expect(this.houseMaester.location).toBe('play area');
        expect(this.houseMaester.isShadow()).toBe(false);
        expect(this.theRoseroad.isShadow()).toBe(true);
        this.player1.clickCard(this.theRoseroad);
        expect(this.theRoseroad.location).toBe('play area');
        expect(this.theRoseroad.isShadow()).toBe(false);
        expect(this.player1Object.gold).toBe(0);
        expect(this.handmaiden.kneeled).toBe(false);
        expect(enemyTower.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot pay the kneeling cost without a card of either named trait', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['House Maester'], hand: ['We Light the Way'] }
        });
        expect(this.player1.actionUnavailableReason(this.weLightTheWay)).toBe('cost');
        expect(this.player1).isReadyToTakeAction();
    });
});
