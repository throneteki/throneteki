describe('Cast Me Forth', function () {
    it('grants ambush at printed cost and allows non-unique Drowned God characters from your dead pile', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Cast Me Forth (ATT)',
                deadPile: [
                    'Priest of the Drowned God (NMG)',
                    'Aeron Damphair (Core)',
                    'Bastard in Hiding'
                ],
                gold: 10
            },
            player2: { deadPile: ['Drowned Men'] }
        });
        expect(this.priestOfTheDrownedGod.getAmbushCost()).toBe(
            this.priestOfTheDrownedGod.getPrintedCost()
        );
        expect(this.aeronDamphair.getAmbushCost()).toBe(this.aeronDamphair.getPrintedCost());
        expect(this.player1Object.isCardInPlayableLocation(this.aeronDamphair, 'ambush')).toBe(
            false
        );
        expect(this.player1Object.isCardInPlayableLocation(this.bastardInHiding, 'ambush')).toBe(
            false
        );
        expect(this.drownedMen.hasKeyword('ambush')).toBe(false);
        this.player1.clickCard(this.priestOfTheDrownedGod);
        expect(this.priestOfTheDrownedGod.location).toBe('play area');
        expect(this.player1Object.gold).toBe(7);
        expect(this.aeronDamphair.location).toBe('dead pile');
        expect(this.bastardInHiding.location).toBe('dead pile');
        expect(this.drownedMen.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('allows a unique Drowned God character to ambush from hand at printed cost', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Cast Me Forth (ATT)',
                hand: [
                    'Aeron Damphair (Core)',
                    'Great Wyk',
                    'Driftwood Cudgel',
                    'The Drowned God Wakes',
                    'Bastard in Hiding'
                ],
                gold: 10
            }
        });
        expect(this.aeronDamphair.getAmbushCost()).toBe(3);
        expect(this.greatWyk.getAmbushCost()).toBeUndefined();
        expect(this.driftwoodCudgel.getAmbushCost()).toBeUndefined();
        expect(this.theDrownedGodWakes.getAmbushCost()).toBeUndefined();
        expect(this.bastardInHiding.getAmbushCost()).toBeUndefined();
        this.player1.clickCard(this.aeronDamphair);
        expect(this.aeronDamphair.location).toBe('play area');
        expect(this.player1Object.gold).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
