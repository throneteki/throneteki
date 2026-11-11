describe('The Pointy End', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['The Pointy End (FH)'],
                inPlay: [
                    { card: 'Robb Stark (Core)', dupes: 1, power: 3 },
                    {
                        card: 'Hedge Knight',
                        power: 3,
                        attachments: ['Noble Lineage', 'Little Bird (Core)']
                    }
                ]
            }
        });
        [this.dupe] = this.robbStark.dupes;
        [this.lineage, this.bird] = this.hedgeKnight.attachments;
        this.player1.selectPlot('The Pointy End');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('discards each duplicate and power from a character with fewer than 2 attachments', function () {
        this.player1.clickCard(this.robbStark);
        expect(this.dupe.location).toBe('discard pile');
        expect(this.robbStark.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('discards each attachment from a character with 2 or more attachments', function () {
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        expect(this.lineage.location).toBe('discard pile');
        expect(this.bird.location).toBe('discard pile');
        expect(this.hedgeKnight.power).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
