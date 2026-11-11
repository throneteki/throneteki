describe("King's Blood", function () {
    describe('during the plot phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    inPlay: [
                        {
                            card: 'Bastard in Hiding',
                            attachments: [{ card: "King's Blood", gold: 2 }]
                        }
                    ]
                },
                player2: { power: 3 }
            });
            this.player1.togglePromptedActionWindow('plot', true);
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
            this.player1.clickMenu(this.kingsBlood, "Discard power from opponent's faction");
        });

        it("kneels the attached character and sacrifices itself to discard X power from each opponent's faction card", function () {
            expect(this.player2Object.faction.power).toBe(1);
            expect(this.bastardInHiding.kneeled).toBe(true);
            expect(this.kingsBlood.location).toBe('discard pile');
        });
    });
});
