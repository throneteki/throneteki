describe("Hagen's Daughter", function () {
    it('saves herself from military claim and returns to shadows', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["Hagen's Daughter"] },
            player2: { inPlay: ['Ranging Party'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.rangingParty);
        this.player1.clickCard(this.hagensDaughter);
        this.player1.triggerAbility("Hagen's Daughter");
        expect(this.hagensDaughter.location).toBe('shadows');
        expect(this.hagensDaughter.getShadowCost()).toBe(2);
        expect(this.player1Object.deadPile.length).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });

    it('cannot save herself from an effect that says cannot be saved', function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Wildfire Assault'],
                inPlay: ["Hagen's Daughter", 'House Maester', 'Handmaiden', 'Ranging Party']
            }
        });
        this.player1.selectPlot('Wildfire Assault');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.houseMaester);
        this.player1.clickCard(this.handmaiden);
        this.player1.clickCard(this.rangingParty);
        this.player1.clickPrompt('Done');
        expect(this.player1).not.toAllowAbilityTrigger("Hagen's Daughter");
        expect(this.hagensDaughter.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('can save herself from burn because moving to shadows removes the lethal effect', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["Hagen's Daughter"] },
            player2: { inPlay: ['Ranging Party', 'Drogon (Core)'], hand: ['Dracarys!'], gold: 1 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.rangingParty);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.hagensDaughter);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Pass');
        this.player2.clickCard(this.dracarys);
        this.player2.clickCard(this.drogon);
        this.player2.clickCard(this.hagensDaughter);
        this.player1.triggerAbility("Hagen's Daughter");
        expect(this.hagensDaughter.location).toBe('shadows');
        expect(this.hagensDaughter.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
