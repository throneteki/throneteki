describe('Grey Cliffs', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Broken Men'],
                inPlay: ['Grey Cliffs', 'The Riverroad', 'Tumblestone Knight']
            },
            player2: {
                faction: 'martell',
                inPlay: ['Bastard in Hiding', 'House Dayne Knight']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.bastardInHiding);
        this.player2.clickCard(this.houseDayneKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        this.player1.triggerAbility('Broken Men');
    });

    it('gives its controller +1 initiative', function () {
        expect(this.player1Object.getInitiative()).toBe(
            this.player1Object.activePlot.cardData.plotStats.initiative + 1
        );
        this.player1.clickCard(this.theRiverroad);
        this.player1.clickCard(this.bastardInHiding);
        expect(this.player1).isReadyToTakeAction();
    });

    describe('when it is sacrificed', function () {
        beforeEach(function () {
            this.player1.clickCard(this.greyCliffs);
        });

        it('can be triggered', function () {
            expect(this.player1).toAllowAbilityTrigger(this.greyCliffs);
            this.player1.clickPrompt('Pass');
            this.player1.clickCard(this.bastardInHiding);
            expect(this.player1).isReadyToTakeAction();
        });

        it('draws 1 card', function () {
            this.player1.triggerAbility(this.greyCliffs);
            this.player1.clickCard(this.bastardInHiding);

            expect(this.greyCliffs.location).toBe('discard pile');
            expect(this.player1Object.hand.length).toBe(1);
            expect(this.bastardInHiding.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when another location is sacrificed', function () {
        beforeEach(function () {
            this.player1.clickCard(this.theRiverroad);
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.greyCliffs);
            this.player1.clickCard(this.bastardInHiding);

            expect(this.greyCliffs.location).toBe('play area');
            expect(this.player1Object.hand).toEqual([]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
