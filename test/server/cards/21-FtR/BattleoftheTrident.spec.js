describe('Battle of the Trident', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'Battle of the Trident',
                inPlay: ['Ranging Party', 'House Maester', "The Titan's Bastard"],
                plotDeck: ['Fortified Position', 'Supporting the Faith', 'A Noble Cause'],
                usedPlots: ['Sneak Attack']
            },
            player2: { inPlay: ['Castle Guard'], power: 1 }
        });
    });

    it('reveals a Siege plot after power claim and removes a chosen used plot', function () {
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.rangingParty);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).toAllowAbilityTrigger(this.battleOfTheTrident);
        this.player1.triggerAbility(this.battleOfTheTrident);
        expect(this.player1).toBeAbleToSelect(this.fortifiedPosition);
        expect(this.player1).not.toBeAbleToSelect(this.supportingTheFaith);
        expect(this.player1).not.toBeAbleToSelect(this.aNobleCause);
        expect(this.player1).not.toBeAbleToSelect(this.sneakAttack);
        this.player1.clickCard(this.fortifiedPosition);
        expect(this.player1).toBeAbleToSelect(this.sneakAttack);
        expect(this.player1).not.toBeAbleToSelect(this.aNobleCause);
        this.player1.clickCard(this.sneakAttack);
        expect(this.player1Object.activePlot).toBe(this.fortifiedPosition);
        expect(this.sneakAttack.location).toBe('out of game');
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1Object.faction.power).toBe(2);
        expect(this.player2Object.faction.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('reveals a War plot after military claim has killed the defender', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.rangingParty);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.castleGuard);
        expect(this.castleGuard.location).toBe('dead pile');
        this.player1.triggerAbility(this.battleOfTheTrident);
        expect(this.player1).toBeAbleToSelect(this.fortifiedPosition);
        expect(this.player1).not.toBeAbleToSelect(this.supportingTheFaith);
        this.player1.clickCard(this.fortifiedPosition);
        this.player1.clickCard(this.sneakAttack);
        expect(this.player1Object.activePlot).toBe(this.fortifiedPosition);
        expect(this.sneakAttack.location).toBe('out of game');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not trigger when the attacking characters are neither Army nor Commander', function () {
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.houseMaester);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).not.toAllowAbilityTrigger(this.battleOfTheTrident);
        expect(this.player1Object.faction.kneeled).toBe(false);
        expect(this.fortifiedPosition.location).toBe('plot deck');
        expect(this.sneakAttack.location).toBe('revealed plots');
        expect(this.player1).isReadyToTakeAction();
    });

    it('reveals an Edict plot for an attacking Commander in an intrigue challenge', function () {
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.theTitansBastard);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.battleOfTheTrident);
        expect(this.player1).toBeAbleToSelect(this.supportingTheFaith);
        expect(this.player1).not.toBeAbleToSelect(this.fortifiedPosition);
        expect(this.player1).not.toBeAbleToSelect(this.aNobleCause);
        this.player1.clickCard(this.supportingTheFaith);
        this.player1.clickCard(this.sneakAttack);
        expect(this.player1Object.activePlot).toBe(this.supportingTheFaith);
        expect(this.sneakAttack.location).toBe('out of game');
        expect(this.player1).isReadyToTakeAction();
    });

    it('returns the removed plot to the used pile as soon as only one plot remains unrevealed', function () {
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.rangingParty);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.battleOfTheTrident);
        this.player1.clickCard(this.fortifiedPosition);
        this.player1.clickCard(this.sneakAttack);
        expect(this.sneakAttack.location).toBe('out of game');
        this.completeRound();
        this.player1.selectPlot(this.supportingTheFaith);
        this.player2.selectPlot('Filler Plot');
        expect(this.sneakAttack.location).toBe('revealed plots');
        expect(this.player1Object.plotDiscard).toContain(this.sneakAttack);
        expect(this.player1Object.getPlots()).toHaveLength(1);
        this.selectFirstPlayer(this.player1);
        expect(this.player1).isReadyToTakeAction();
    });
});
