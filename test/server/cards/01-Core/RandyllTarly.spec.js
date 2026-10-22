describe('Randyll Tarly (Core)', function () {
    describe('when his STR is increased by a character ability', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [
                        { card: 'Randyll Tarly (Core)', kneeling: true },
                        'Margaery Tyrell (Core)'
                    ]
                }
            });
            this.player1.clickMenu(this.margaeryTyrell, 'Give character +3 STR');
            this.player1.clickCard(this.randyllTarly);
            this.player1.triggerAbility(this.randyllTarly);
        });

        it('stands him', function () {
            expect(this.randyllTarly.kneeled).toBe(false);
            expect(this.randyllTarly.getStrength()).toBe(8);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when his STR is increased by a plot', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plotDeck: ['A Song of Summer'],
                    inPlay: [{ card: 'Randyll Tarly (Core)', kneeling: true }]
                }
            });
            this.player1.selectPlot('A Song of Summer');
            this.player2.selectPlot('Filler Plot');
            this.player1.triggerAbility(this.randyllTarly);
            this.selectFirstPlayer(this.player1);
        });

        it('stands him', function () {
            expect(this.randyllTarly.kneeled).toBe(false);
            expect(this.randyllTarly.getStrength()).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when his STR is decreased', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Randyll Tarly (Core)'] },
                player2: { inPlay: ['Rhaegal (Core)'], hand: ['Dracarys!'] }
            });
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.randyllTarly);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Pass');
            this.player2.clickCard(this.dracarys);
            this.player2.clickCard(this.rhaegal);
            this.player2.clickCard(this.randyllTarly);
            this.player1.clickPrompt('Pass');
            this.player2.clickPrompt('Pass');
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
        });

        it('does not stand him', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.randyllTarly);
            expect(this.randyllTarly.kneeled).toBe(true);
            expect(this.randyllTarly.getStrength()).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not stand him when the decrease ends', function () {
            this.player1.togglePromptedActionWindow('dominance', true);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');

            expect(this.player1).not.toAllowAbilityTrigger(this.randyllTarly);
            expect(this.randyllTarly.kneeled).toBe(true);
            expect(this.randyllTarly.getStrength()).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
