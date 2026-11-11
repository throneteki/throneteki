describe("Griffin's Roost", function () {
    for (const name of ['Hedge Knight', 'Ser Jorah Mormont (LMHR)']) {
        it(`places ${name} in shadows and preserves any printed shadow cost`, function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ["Griffin's Roost", 'Jon Connington'], hand: [name], gold: 4 },
                player2: { inPlay: ['Jon Connington'], hand: ['House Maester'] }
            });
            const jon = this.player1.findCardByName('Jon Connington', 'play area');
            const enemyJon = this.player2.findCardByName('Jon Connington', 'play area');
            const card = this.player1.findCardByName(name, 'hand');
            expect(jon.hasIcon('power')).toBe(true);
            expect(enemyJon.hasIcon('power')).toBe(false);
            this.unopposedChallenge(this.player1, 'Power', jon);
            this.player1.triggerAbility("Griffin's Roost");
            expect(this.player1).toBeAbleToSelect(card);
            expect(this.player1).not.toBeAbleToSelect(this.houseMaester);
            expect(this.player1).not.toBeAbleToSelect(jon);
            this.player1.clickCard(card);
            expect(card.location).toBe('shadows');
            expect(card.tokens.shadow).toBe(1);
            expect(card.getShadowCost()).toBe(name === 'Hedge Knight' ? 2 : 4);
            expect(this.player1Object.faction.kneeled).toBe(true);
            expect(this.game.cardVisibility.isVisible(card, this.player2Object)).toBe(false);
            this.player1.clickCard(card);
            expect(card.location).toBe('play area');
            expect(card.isShadow()).toBe(name !== 'Hedge Knight');
            expect(this.player1Object.gold).toBe(name === 'Hedge Knight' ? 2 : 0);
            expect(enemyJon.hasIcon('power')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    }

    it('does not react to winning a military challenge', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["Griffin's Roost", 'Ranging Party'], hand: ['House Maester'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.rangingParty);
        expect(this.player1).not.toAllowAbilityTrigger("Griffin's Roost");
        expect(this.houseMaester.location).toBe('hand');
        expect(this.player1Object.faction.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
