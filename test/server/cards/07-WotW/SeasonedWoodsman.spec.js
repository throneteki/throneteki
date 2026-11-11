describe('Seasoned Woodsman', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                gold: 3,
                hand: ['Noble Lineage', "Syrio's Training", 'Little Bird (Core)', 'Knighted'],
                inPlay: ['Seasoned Woodsman', 'House Maester']
            }
        });
    });

    describe('when you attach an attachment to it', function () {
        beforeEach(function () {
            this.player1.clickCard(this.nobleLineage);
            this.player1.clickCard(this.seasonedWoodsman);
            this.player1.triggerAbility(this.seasonedWoodsman);
        });

        it('lets you gain 1 gold', function () {
            this.player1.clickPrompt('Gain 1 gold');

            expect(this.player1Object.gold).toBe(4);
            expect(this.player1Object.hand).toHaveLength(3);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Seasoned Woodsman to gain 1 gold'
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets you draw 1 card instead', function () {
            this.player1.clickPrompt('Draw 1 card');

            expect(this.player1Object.gold).toBe(3);
            expect(this.player1Object.hand).toHaveLength(4);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Seasoned Woodsman to draw 1 card'
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('can only be triggered twice per phase', function () {
            this.player1.clickPrompt('Gain 1 gold');
            this.player1.clickCard(this.syriosTraining);
            this.player1.clickCard(this.seasonedWoodsman);
            this.player1.triggerAbility(this.seasonedWoodsman);
            this.player1.clickPrompt('Gain 1 gold');
            this.player1.clickCard(this.littleBird);
            this.player1.clickCard(this.seasonedWoodsman);

            expect(this.player1).not.toAllowAbilityTrigger(this.seasonedWoodsman);
            expect(this.player1Object.gold).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you attach an attachment to another character', function () {
        beforeEach(function () {
            this.player1.clickCard(this.nobleLineage);
            this.player1.clickCard(this.houseMaester);
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.seasonedWoodsman);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
