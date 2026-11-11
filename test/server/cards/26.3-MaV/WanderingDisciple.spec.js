describe('Wandering Disciple', function () {
    it('puts only your eligible non-unique Drowned God character into play, then discards it at phase end', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                shadows: ['Wandering Disciple'],
                deadPile: [
                    'Priest of Old Wyk',
                    'Drowned Men',
                    'Aeron Damphair (Core)',
                    'House Maester'
                ],
                discard: ['Priest of the Drowned God (NMG)'],
                gold: 3
            },
            player2: { deadPile: ["Drowned God's Apostle"] }
        });
        this.player1.clickCard(this.wanderingDisciple);
        this.player1.triggerAbility('Wandering Disciple');
        expect(this.player1).toBeAbleToSelect(this.priestOfOldWyk);
        expect(this.player1).toBeAbleToSelect(this.drownedMen);
        for (const card of [
            this.aeronDamphair,
            this.houseMaester,
            this.priestOfTheDrownedGod,
            this.drownedGodsApostle,
            this.wanderingDisciple
        ]) {
            expect(this.player1).not.toBeAbleToSelect(card);
        }
        this.player1.clickCard(this.priestOfOldWyk);
        expect(this.priestOfOldWyk.location).toBe('play area');
        this.completeMarshalPhase();
        expect(this.priestOfOldWyk.location).toBe('discard pile');
        for (const card of [
            this.drownedMen,
            this.aeronDamphair,
            this.houseMaester,
            this.drownedGodsApostle
        ]) {
            expect(card.location).toBe('dead pile');
        }
        expect(this.wanderingDisciple.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not resurrect a character if its reaction is cancelled', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Wandering Disciple'], deadPile: ['Priest of Old Wyk'], gold: 3 },
            player2: { inPlay: ['Cersei Lannister (Core)'], hand: ['Treachery'], gold: 1 }
        });
        this.player1.clickCard(this.wanderingDisciple);
        this.player1.triggerAbility('Wandering Disciple');
        this.player1.clickCard(this.priestOfOldWyk);
        this.player2.triggerAbility('Treachery');
        this.completeMarshalPhase();
        expect(this.priestOfOldWyk.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not trigger after marshaling from hand', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Wandering Disciple'], deadPile: ['Priest of Old Wyk'], gold: 3 }
        });
        this.player1.clickCard(this.wanderingDisciple);
        this.player1.clickPrompt('Marshal');
        expect(this.player1).not.toAllowAbilityTrigger('Wandering Disciple');
        expect(this.priestOfOldWyk.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
