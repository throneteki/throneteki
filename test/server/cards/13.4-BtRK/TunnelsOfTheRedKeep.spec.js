describe('Tunnels of the Red Keep', function () {
    it('counts itself and snapshots the STR bonus and affected characters until phase end', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tunnels of the Red Keep', 'House Maester', 'Ranging Party'],
                shadows: ['Penny'],
                gold: 3
            },
            player2: { inPlay: ['Winterfell Steward'] }
        });
        this.player1.clickCard(this.tunnelsOfTheRedKeep);
        expect(this.tunnelsOfTheRedKeep.location).toBe('shadows');
        expect(this.houseMaester.getStrength()).toBe(4);
        expect(this.rangingParty.getStrength()).toBe(7);
        expect(this.winterfellSteward.getStrength()).toBe(1);
        this.player1.clickCard(this.penny);
        expect(this.penny.getStrength()).toBe(2);
        expect(this.houseMaester.getStrength()).toBe(4);
        this.player1.clickCard(this.tunnelsOfTheRedKeep);
        expect(this.player1Object.shadows.length).toBe(0);
        expect(this.houseMaester.getStrength()).toBe(4);
        expect(this.rangingParty.getStrength()).toBe(7);
        expect(this.player1.actionUnavailableReason(this.tunnelsOfTheRedKeep)).toBe('limit');
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        expect(this.houseMaester.getStrength()).toBe(2);
        expect(this.rangingParty.getStrength()).toBe(5);
        expect(this.penny.getStrength()).toBe(2);
        expect(this.winterfellSteward.getStrength()).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gives one STR when it is your only card in shadows', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tunnels of the Red Keep', 'House Maester'] }
        });
        this.player1.clickCard(this.tunnelsOfTheRedKeep);
        expect(this.houseMaester.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not apply a bonus when the return to shadows is cancelled', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tunnels of the Red Keep', 'House Maester'] },
            player2: { inPlay: ['Cersei Lannister (Core)'], hand: ['Treachery'], gold: 1 }
        });
        this.player1.clickCard(this.tunnelsOfTheRedKeep);
        this.player2.triggerAbility('Treachery');
        expect(this.tunnelsOfTheRedKeep.location).toBe('play area');
        expect(this.tunnelsOfTheRedKeep.kneeled).toBe(true);
        expect(this.houseMaester.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
