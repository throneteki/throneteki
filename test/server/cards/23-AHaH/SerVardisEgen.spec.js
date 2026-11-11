describe('Ser Vardis Egen', function () {
    function challenge(context, opponent, defend = true) {
        context.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Vardis Egen (AHaH)', 'House Maester'] },
            player2: { inPlay: [opponent], gold: 4 }
        });
        const attacker = context.player2Object.cardsInPlay[0];
        context.player1.clickPrompt('Done');
        context.player2.clickPrompt('Military');
        context.player2.clickCard(attacker);
        context.player2.clickPrompt('Done');
        context.skipActionWindow();
        if (defend) context.player1.clickCard(context.serVardisEgen);
        context.player1.clickPrompt('Done');
        context.skipActionWindow();
        return attacker;
    }

    it('sacrifices himself after losing on defense to place an attacker in shadows with a shadow cost', function () {
        const attacker = challenge(this, 'Ranging Party');
        this.player1.triggerAbility('Ser Vardis Egen');
        expect(this.serVardisEgen.location).toBe('discard pile');
        expect(this.player1).toBeAbleToSelect(attacker);
        expect(this.player1).not.toBeAbleToSelect(this.houseMaester);
        this.player1.clickCard(attacker);
        expect(attacker.location).toBe('shadows');
        expect(attacker.getShadowCost()).toBe(4);
        expect(attacker.tokens.shadow).toBe(1);
        this.player1.clickCard(this.houseMaester);
        this.player2.clickCard(attacker);
        expect(attacker.location).toBe('play area');
        expect(attacker.isShadow()).toBe(false);
        expect(this.player2Object.gold).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });

    it('cannot save the placement in shadows with a duplicate', function () {
        const attacker = challenge(this, { card: 'Drogon (Core)', dupes: 1 });
        this.player1.triggerAbility('Ser Vardis Egen');
        this.player1.clickCard(attacker);
        expect(attacker.location).toBe('shadows');
        expect(attacker.dupes.length).toBe(0);
        expect(attacker.tokens.shadow).toBe(1);
        this.player1.clickCard(this.houseMaester);
        expect(this.serVardisEgen.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });

    it('does not react when he did not defend the lost challenge', function () {
        challenge(this, 'Ranging Party', false);
        expect(this.player1).not.toAllowAbilityTrigger('Ser Vardis Egen');
        this.player1.clickCard(this.houseMaester);
        expect(this.serVardisEgen.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });

    it('does not react when his side wins the challenge', function () {
        challenge(this, 'Old Forest Hunter');
        expect(this.player1).not.toAllowAbilityTrigger('Ser Vardis Egen');
        expect(this.serVardisEgen.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
