describe('Bran Stark (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ["The Dragon's Tail (AtSK)"],
                inPlay: ['Bran Stark (Core)', 'Dacey Mormont']
            },
            player2: {
                gold: 1,
                hand: ['Nightmares']
            }
        });
    });

    describe("when an opponent's event would initiate", function () {
        beforeEach(function () {
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.nightmares);
            this.player2.clickCard(this.daceyMormont);
        });

        it('sacrifices Bran Stark to cancel its effects', function () {
            this.player1.triggerAbility(this.branStark);

            expect(this.branStark.location).toBe('discard pile');
            expect(this.nightmares.location).toBe('discard pile');
            expect(this.player2Object.gold).toBe(0);
            expect(this.daceyMormont.hasKeyword('renown')).toBe(true);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 sacrifices Bran Stark to cancel Nightmares'
            );
            expect(this.player2).isReadyToTakeAction();
        });

        it('lets the effects resolve when declined', function () {
            this.player1.clickPrompt('Pass');

            expect(this.branStark.location).toBe('play area');
            expect(this.daceyMormont.hasKeyword('renown')).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when your own event would initiate', function () {
        beforeEach(function () {
            this.player1.clickCard(this.theDragonsTail);
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.branStark);
            expect(this.branStark.location).toBe('play area');
            expect(this.player1Object.hand).toHaveLength(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
