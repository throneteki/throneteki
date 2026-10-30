describe('Candle in the Dark', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    { card: 'Tumblestone Knight', attachments: ['Candle in the Dark'] },
                    'Winterfell Steward'
                ]
            },
            player2: { faction: 'baratheon', shadows: ['Shadow Priestess'], gold: 3 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.shadowPriestess);
        this.player2.triggerAbility(this.shadowPriestess);
        this.player2.clickCard(this.winterfellSteward);
        this.player1.triggerAbility(this.candleInTheDark);
    });

    it('stops the attached character being bypassed by stealth, and kneels it to cancel the effects of a triggered ability of a card with shadow', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.winterfellSteward.kneeled).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
