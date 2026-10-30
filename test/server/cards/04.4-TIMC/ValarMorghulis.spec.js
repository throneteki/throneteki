describe('Valar Morghulis', function () {
    function reveal() {
        this.player1.selectPlot('Valar Morghulis');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    }

    describe('when there are both interrupts and reactions to dying', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plotDeck: ['Valar Morghulis'],
                    inPlay: [{ card: 'Margaery Tyrell (AMAF)', dupes: 1 }, 'Rickon Stark'],
                    drawDeck: ['Eddard Stark (Core)']
                },
                player2: { inPlay: ['Maester Aemon (Core)', 'Samwell Tarly (Core)'] }
            });
            reveal.call(this);
        });

        it('prompts interrupts and reactions in the proper order', function () {
            expect(this.player1).not.toAllowAbilityTrigger('Margaery Tyrell');
            expect(this.player2).toAllowAbilityTrigger('Maester Aemon');

            this.player2.triggerAbility('Maester Aemon');
            this.player2.clickCard(this.samwellTarly);
            expect(this.samwellTarly.location).toBe('play area');
            expect(this.maesterAemon.location).toBe('dead pile');

            expect(this.margaeryTyrell.location).toBe('play area');
            expect(this.margaeryTyrell.dupes.length).toBe(0);
            expect(this.rickonStark.location).toBe('dead pile');

            expect(this.player1).toAllowAbilityTrigger('Margaery Tyrell');
        });
    });

    describe('when multiple characters die', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plotDeck: ['Valar Morghulis'],
                    inPlay: [{ card: 'Arya Stark (Core)', dupes: 1 }, 'Hedge Knight']
                },
                player2: { inPlay: ['Arya Stark (Core)', 'Hedge Knight', 'House Maester'] }
            });
            [this.deadArya] = this.player2.filterCardsByName('Arya Stark', 'play area');
            [this.deadKnight] = this.player2.filterCardsByName('Hedge Knight', 'play area');
            this.deadMaester = this.player2.findCardByName('House Maester', 'play area');
            reveal.call(this);
        });

        it('does not prompt to choose dead pile order if only one character will die', function () {
            expect(this.player1).not.toHavePrompt(
                'Select order to place cards in your dead pile (top first)'
            );
        });

        it('lets dead pile order be chosen for multiple characters', function () {
            expect(this.player2).toHavePrompt(
                'Select order to place cards in your dead pile (top first)'
            );
            this.player2.clickCard(this.deadMaester);
            this.player2.clickCard(this.deadArya);
            this.player2.clickCard(this.deadKnight);
            this.player2.clickPrompt('Done');

            expect(this.player2Object.deadPile.map((card) => card.name)).toEqual([
                'Hedge Knight',
                'Arya Stark',
                'House Maester'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
