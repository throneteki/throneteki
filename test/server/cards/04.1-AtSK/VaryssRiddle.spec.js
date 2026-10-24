describe("Varys's Riddle", function () {
    function reveal(context, player1, player2) {
        context.setupTest({
            phase: 'plot',
            player1: { plotDeck: ["Varys's Riddle"], ...player1 },
            player2
        });
        context.player1.selectPlot("Varys's Riddle");
        context.player2.selectPlot(player2.plotDeck[0]);
    }

    it('does not crash when there are plot modifiers out', function () {
        reveal(
            this,
            { faction: 'greyjoy', inPlay: ['The Roseroad'] },
            { faction: 'lannister', plotDeck: ['Wildfire Assault'] }
        );
        expect(() => {
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);
        }).not.toThrow();
    });

    it('has its reserve reduced by Wraiths in Their Midst', function () {
        reveal(this, {}, { faction: 'lannister', plotDeck: ['Wraiths in Their Midst'] });
        this.selectFirstPlayer(this.player1);
        expect(this.varyssRiddle.getReserve()).toBe(5);
    });

    describe('against Calm Over Westeros', function () {
        beforeEach(function () {
            reveal(
                this,
                { faction: 'lannister' },
                {
                    faction: 'lannister',
                    agenda: '"The Rains of Castamere"',
                    plotDeck: ['Calm Over Westeros', 'Power Behind the Throne'],
                    inPlay: ['The Tickler', 'Ser Jaime Lannister (Core)']
                }
            );
            this.selectFirstPlayer(this.player2);
            this.selectPlotOrder(this.player1);
            this.player1.clickCard(this.calmOverWesteros);
            this.player1.clickPrompt('Intrigue');
            this.player2.clickPrompt('Military');
            this.completeMarshalPhase();
        });

        it('initiates its When Revealed ability to reduce claim', function () {
            const discarded = this.player1Object.discardPile.length;
            this.unopposedChallenge(this.player2, 'Intrigue', this.theTickler);
            expect(this.player1Object.discardPile).toHaveLength(discarded);
        });

        it('keeps the claim reduced when Calm is replaced using Rains', function () {
            const discarded = this.player1Object.discardPile.length;
            this.unopposedChallenge(this.player2, 'Intrigue', this.serJaimeLannister);
            this.player2.triggerAbility('"The Rains of Castamere"');
            this.player2.clickCard(this.powerBehindTheThrone);
            expect(this.player1Object.discardPile).toHaveLength(discarded);
        });
    });

    it('does not trigger reactions to plots being revealed', function () {
        reveal(
            this,
            {},
            { faction: 'stark', plotDeck: ['Trading with the Pentoshi'], inPlay: ['Old Nan'] }
        );
        this.player2.clickPrompt('Pass');
        this.selectFirstPlayer(this.player1);
        this.selectPlotOrder(this.player1);
        expect(this.player2).not.toAllowAbilityTrigger('Old Nan');
    });
});
