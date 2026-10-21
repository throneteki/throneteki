describe('Frozen Solid', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'stark',
                hand: ['Frozen Solid'],
                inPlay: ['Old Gate']
            },
            player2: {
                faction: 'stark',
                inPlay: [
                    { card: 'Northern Armory', kneeling: true },
                    'Harrenhal (TTWDFL)',
                    'Horn Hill (WGYK)',
                    'Tumblestone Knight'
                ]
            }
        });

        this.player1.clickCard(this.frozenSolid);
    });

    it('attaches only to a non-limited location with printed cost 3 or lower', function () {
        expect(this.player1).toBeAbleToSelect(this.northernArmory);
        expect(this.player1).toBeAbleToSelect(this.harrenhal);
        expect(this.player1).not.toBeAbleToSelect(this.hornHill);
        expect(this.player1).not.toBeAbleToSelect(this.oldGate);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.northernArmory);

        expect(this.frozenSolid.parent).toBe(this.northernArmory);
        expect(this.frozenSolid.hasKeyword('Terminal')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    describe('when attached', function () {
        beforeEach(function () {
            this.player1.clickCard(this.northernArmory);
            this.player1.clickPrompt('Done');
        });

        it("blanks the attached location's text box except its Traits", function () {
            expect(this.northernArmory.hasTrait('The North')).toBe(true);
            expect(this.player2.actionUnavailableReason(this.northernArmory)).toBe('blank');
            expect(this.player2Object.gold).toBe(5);
            expect(this.northernArmory.isBlankExcludingTraits()).toBe(true);
            expect(this.harrenhal.isAnyBlank()).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });

        it('lets the attached location stand in the standing phase', function () {
            this.player2.clickPrompt('Done');
            this.completeChallengesPhase();

            expect(this.northernArmory.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
