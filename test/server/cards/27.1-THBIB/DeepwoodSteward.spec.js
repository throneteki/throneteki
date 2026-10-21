describe('Deepwood Steward', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'baratheon',
                hand: ['Deepwood Steward'],
                drawDeck: [
                    'Grey Cliffs',
                    'Hornvale (WGYK)',
                    'The Riverroad',
                    'Dragonstone Port',
                    'Winterfell Steward',
                    'House Maester',
                    'House Maester',
                    'House Maester',
                    'House Maester',
                    'House Maester',
                    'Skirling Pass'
                ]
            }
        });

        this.player1.clickCard(this.deepwoodSteward);
    });

    it('can be triggered after it is marshaled', function () {
        expect(this.player1).toAllowAbilityTrigger(this.deepwoodSteward);

        this.player1.clickPrompt('Pass');

        expect(this.player1).isReadyToTakeAction();
    });

    describe('when triggered', function () {
        beforeEach(function () {
            this.player1.triggerAbility(this.deepwoodSteward);
        });

        it('can choose a The North or out-of-faction location in the top 10 cards', function () {
            expect(this.player1).toBeAbleToSelect(this.greyCliffs);
            expect(this.player1).toBeAbleToSelect(this.hornvale);
            expect(this.player1).not.toBeAbleToSelect(this.theRiverroad);
            expect(this.player1).not.toBeAbleToSelect(this.dragonstonePort);
            expect(this.player1).not.toBeAbleToSelect(this.winterfellSteward);
            expect(this.player1).not.toBeAbleToSelect(this.skirlingPass);

            this.player1.clickCard(this.greyCliffs);

            expect(this.player1).isReadyToTakeAction();
        });

        it('adds the chosen location to your hand', function () {
            this.player1.clickCard(this.hornvale);

            expect(this.hornvale.location).toBe('hand');
            expect(this.greyCliffs.location).toBe('draw deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
