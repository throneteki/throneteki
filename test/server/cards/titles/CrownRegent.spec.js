describe('Crown Regent', function () {
    function setup(context, stealth = false) {
        context.setupTest({
            gameFormat: 'melee',
            phase: 'plot',
            player1: { inPlay: ['Desert Scavenger'] },
            player2: { inPlay: ['Ranging Party', stealth ? 'Maester Wendamyr' : 'House Maester'] },
            player3: { inPlay: ['Winterfell Steward'] }
        });
        for (const player of [context.player1, context.player2, context.player3])
            player.selectPlot('Filler Plot');
        context.selectFirstPlayer(context.player1);
        context.player1.selectTitle('Crown Regent');
        context.player2.selectTitle('Master of Ships');
        context.player3.selectTitle('Master of Whispers');
        context.completeMarshalPhase();
    }

    function initiate(context, type, card) {
        context.player2.clickPrompt(type);
        context.player2.clickPrompt('player1');
        context.player2.clickCard(card);
        context.player2.clickPrompt('Done');
    }

    it('redirects to a supported opponent and cannot redirect a second challenge that round', function () {
        setup(this);
        this.player1.clickPrompt('Done');
        initiate(this, 'Military', this.rangingParty);
        expect(this.player1).toAllowAbilityTrigger('Crown Regent');
        this.player1.triggerAbility('Crown Regent');
        expect(this.player2).not.toHavePromptButton('player1');
        expect(this.player2).not.toHavePromptButton('player2');
        expect(this.player2).not.toHavePromptButton('Cancel');
        expect(this.player2).toHavePromptButton('player3');
        this.player2.clickPrompt('player3');
        expect(this.game.currentChallenge.defendingPlayer).toBe(this.player3Object);
        expect(this.game.currentChallenge.initiatedAgainstPlayer).toBe(this.player1Object);
        expect(this.game.currentChallenge.declaredAttackers).toEqual([this.rangingParty]);
        expect(this.game.currentChallenge.challengeType).toBe('military');
        this.skipActionWindow();
        this.player3.clickPrompt('Done');
        this.skipActionWindow();
        this.player3.clickCard(this.winterfellSteward);
        expect(this.winterfellSteward.location).toBe('dead pile');
        expect(this.desertScavenger.location).toBe('play area');
        initiate(this, 'Intrigue', this.houseMaester);
        expect(this.player1).not.toAllowAbilityTrigger('Crown Regent');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player2).isReadyToTakeAction();
    });

    it('allows declining to use the optional redirect interrupt', function () {
        setup(this);
        this.player1.clickPrompt('Done');
        initiate(this, 'Military', this.rangingParty);
        this.player1.clickPrompt('Pass');
        expect(this.game.currentChallenge.defendingPlayer).toBe(this.player1Object);
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.desertScavenger);
        expect(this.desertScavenger.location).toBe('dead pile');
        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });

    it('adds two dominance strength only to its bearer', function () {
        setup(this);
        expect(this.player1Object.title.getDominanceStrength()).toBe(2);
        expect(this.player1Object.getDominance()).toBe(
            this.player1Object.gold + this.desertScavenger.getStrength() + 2
        );
        expect(this.player3Object.getDominance()).toBe(
            this.player3Object.gold + this.winterfellSteward.getStrength()
        );
        expect(this.player1).isReadyToTakeAction();
    });

    it('reselects stealth against the new defender and clears the original bypass', function () {
        setup(this, true);
        this.player1.clickPrompt('Done');
        initiate(this, 'Power', this.maesterWendamyr);
        this.player2.clickCard(this.desertScavenger);
        this.player1.triggerAbility('Crown Regent');
        this.player2.clickPrompt('player3');
        expect(this.player2).toHavePrompt('Select stealth target for Maester Wendamyr');
        this.player2.clickCard(this.winterfellSteward);
        expect(this.winterfellSteward.bypassedByStealth).toBe(true);
        expect(this.desertScavenger.bypassedByStealth).toBe(false);
        expect(this.game.currentChallenge.declaredAttackers).toEqual([this.maesterWendamyr]);
        this.skipActionWindow();
        this.player3.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player2).isReadyToTakeAction();
    });
});
