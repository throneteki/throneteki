describe('Banished from the Light', function () {
    it('can place a character from either side into shadows after a power win and grants its printed cost', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['House Maester', 'Ranging Party', 'The Roseroad'],
                shadows: ['Banished from the Light'],
                gold: 2
            },
            player2: { inPlay: ['Doreah'], gold: 2 }
        });
        this.unopposedChallenge(this.player1, 'Power', this.houseMaester);
        this.player1.triggerAbility('Banished from the Light');
        for (const card of [this.houseMaester, this.rangingParty, this.doreah])
            expect(this.player1).toBeAbleToSelect(card);
        expect(this.player1).not.toBeAbleToSelect(this.theRoseroad);
        this.player1.clickCard(this.doreah);
        expect(this.doreah.location).toBe('shadows');
        expect(this.doreah.tokens.shadow).toBe(1);
        expect(this.doreah.getShadowCost()).toBe(2);
        expect(this.banishedFromTheLight.location).toBe('discard pile');
        expect(this.houseMaester.location).toBe('play area');
        expect(this.rangingParty.location).toBe('play area');
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.doreah);
        expect(this.doreah.location).toBe('play area');
        expect(this.doreah.isShadow()).toBe(false);
        expect(this.player2Object.gold).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });

    it('does not react to winning a military challenge', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ranging Party'], shadows: ['Banished from the Light'], gold: 2 },
            player2: { inPlay: ['House Maester'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.rangingParty);
        expect(this.player1).not.toAllowAbilityTrigger('Banished from the Light');
        this.player2.clickCard(this.houseMaester);
        expect(this.banishedFromTheLight.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
