describe("The Prince's Pass", function () {
    function setup(context, attacker = 'Winterfell Steward') {
        context.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["The Prince's Pass", 'House Maester'] },
            player2: { inPlay: ['Winterfell Steward', 'Sansa Stark (WotN)'] }
        });
        context.player1.clickPrompt('Done');
        context.unopposedChallenge(
            context.player2,
            'Power',
            context.player2.findCardByName(attacker, 'play area')
        );
        expect(context.player1).toAllowAbilityTrigger("The Prince's Pass");
        context.player1.triggerAbility("The Prince's Pass");
        const attacking = context.player2.findCardByName(attacker, 'play area');
        expect(context.player1).toBeAbleToSelect(attacking);
        for (const card of [
            context.houseMaester,
            context.thePrincesPass,
            ...context.player2Object.cardsInPlay.filter((card) => card !== attacking)
        ]) {
            expect(context.player1).not.toBeAbleToSelect(card);
        }
        context.player1.clickCard(attacking);
        context.player1.clickPrompt('Power');
    }

    it('may sacrifice itself to discard an attacker after removing its last icon', function () {
        setup(this);
        expect(this.winterfellSteward.hasIcon('power')).toBe(false);
        this.player1.clickPrompt('Yes');
        expect(this.thePrincesPass.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('discard pile');
        expect(this.sansaStark.hasIcon('power')).toBe(true);
        expect(this.houseMaester.hasIcon('power')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });

    it('may decline the sacrifice and restores the removed icon at phase end', function () {
        setup(this);
        this.player1.clickPrompt('No');
        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.winterfellSteward.hasIcon('power')).toBe(false);
        expect(this.thePrincesPass.kneeled).toBe(true);
        this.player1.togglePromptedActionWindow('dominance', true);
        this.player2.clickPrompt('Done');
        expect(this.winterfellSteward.hasIcon('power')).toBe(true);
        expect(this.thePrincesPass.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not offer a sacrifice if the attacker still has another icon', function () {
        setup(this, 'Sansa Stark');
        expect(this.sansaStark.hasIcon('power')).toBe(false);
        expect(this.sansaStark.hasIcon('intrigue')).toBe(true);
        expect(this.thePrincesPass.location).toBe('play area');
        expect(this.player1).not.toHavePromptButton('Yes');
        expect(this.player2).isReadyToTakeAction();
    });

    it('allows a duplicate to save the attacker after the location is sacrificed', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["The Prince's Pass"] },
            player2: {
                inPlay: [
                    {
                        card: 'Sansa Stark (WotN)',
                        dupes: 1,
                        attachments: [{ card: 'Attainted', owner: 'player1' }]
                    }
                ]
            }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Power', this.sansaStark);
        this.player1.triggerAbility("The Prince's Pass");
        this.player1.clickCard(this.sansaStark);
        this.player1.clickPrompt('Power');
        this.player1.clickPrompt('Yes');
        expect(this.thePrincesPass.location).toBe('discard pile');
        expect(this.sansaStark.location).toBe('play area');
        expect(this.sansaStark.dupes.length).toBe(0);
        expect(this.sansaStark.getNumberOfIcons()).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });

    it('cannot react after losing as the attacker', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["The Prince's Pass", 'House Maester'] },
            player2: { inPlay: ['Sansa Stark (WotN)'] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.houseMaester);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.sansaStark);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).not.toAllowAbilityTrigger("The Prince's Pass");
        expect(this.thePrincesPass.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
