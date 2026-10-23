describe('Set Down Our Deeds', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [{ card: 'Hedge Knight', power: 3 }],
                hand: ['Set Down Our Deeds (HMW)'],
                drawDeck: [
                    'Castle Guard',
                    'Winterfell Steward',
                    'Garden Caretaker',
                    'Desert Scavenger'
                ]
            }
        });
        this.player1.clickCard(this.setDownOurDeeds);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('2');
    });

    it('kneels your faction card to discard up to 3 power from a card you own and draw 2 cards for each', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.hedgeKnight.power).toBe(1);
        expect(this.player1Object.hand.length).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
