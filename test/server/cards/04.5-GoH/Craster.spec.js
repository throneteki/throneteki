describe('Craster', function () {
    function canResurrect() {
        const ability = this.craster.abilities.actions[0];
        return ability.meetsRequirements(ability.createContext(this.player1Object));
    }

    describe('while Craster is out when characters are killed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { inPlay: ['Craster', 'Steward at the Wall'] },
                player2: {
                    plotDeck: ['Valar Morghulis'],
                    inPlay: ['Benjen Stark (Core)', 'Old Forest Hunter']
                }
            });
            this.player1.togglePromptedActionWindow('plot', true);
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Valar Morghulis');
            this.selectFirstPlayer(this.player1);
            this.player2.triggerAbility('Benjen Stark');
            if (
                this.player2.hasPrompt('Select order to place cards in your dead pile (top first)')
            ) {
                this.player2.clickPrompt('Done');
            }
        });

        it('is immune to Omen card effects', function () {
            expect(this.craster.location).toBe('play area');
        });

        it('sacrifices itself to put each character killed this phase into play from the dead pile', function () {
            this.player1.clickMenu(this.craster, 'Sacrifice to resurrect');

            expect(this.craster.location).toBe('discard pile');
            expect(this.stewardAtTheWall.location).toBe('play area');
            expect(this.oldForestHunter.location).toBe('play area');
            expect(this.benjenStark.location).not.toBe('play area');
        });

        it('cannot resurrect characters killed in an earlier phase', function () {
            this.skipActionWindow();

            expect(canResurrect.call(this)).toBe(false);
            expect(this.stewardAtTheWall.location).toBe('dead pile');
        });
    });
});
