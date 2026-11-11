describe('Valyrian Steel (R)', function () {
    it('kneels your faction card and pays X gold to put an attachment with printed cost X into play from your hand', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                agenda: 'Valyrian Steel (R)',
                inPlay: ['Hedge Knight'],
                hand: ['Little Bird (Core)'],
                gold: 5
            }
        });
        this.player1.clickMenu(this.valyrianSteel, 'Put attachment into play');
        this.player1.clickCard(this.littleBird);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.hedgeKnight.attachments).toContain(this.littleBird);
        expect(this.player1Object.gold).toBe(4);
        this.player1.clickPrompt('Pass');
        expect(this.player1).isReadyToTakeAction();
    });

    it('lets you gain 1 gold or draw 1 card after an attachment enters play under your control', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                agenda: 'Valyrian Steel (R)',
                inPlay: ['Hedge Knight'],
                hand: ['Little Bird (Core)'],
                gold: 5
            }
        });
        this.player1.clickCard(this.littleBird);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.player1).toAllowAbilityTrigger('Valyrian Steel');
        this.player1.triggerAbility('Valyrian Steel');
        this.player1.clickPrompt('Gain 1 gold');
        expect(this.player1Object.gold).toBe(5);
    });

    it('triggers when Risen from the Sea attaches itself', function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                agenda: 'Valyrian Steel (R)',
                plotDeck: ['Valar Morghulis'],
                inPlay: ['Theon Greyjoy (Core)'],
                hand: ['Risen from the Sea']
            }
        });
        this.player1.selectPlot('Valar Morghulis');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.risenFromTheSea);
        expect(this.player1).toAllowAbilityTrigger('Valyrian Steel');
    });

    it('does not let The Water Gardens reduce the cost', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'Valyrian Steel (R)',
                plot: 'A Noble Cause',
                usedPlots: ['A Storm of Swords'],
                inPlay: ['Hedge Knight', 'The Water Gardens'],
                hand: ['Little Bird (Core)'],
                gold: 5
            }
        });
        this.player1.clickCard(this.theWaterGardens);
        this.player1.clickMenu(this.valyrianSteel, 'Put attachment into play');
        this.player1.clickCard(this.littleBird);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.player1Object.gold).toBe(4);
        expect(this.hedgeKnight.attachments).toContain(this.littleBird);
        this.player1.clickPrompt('Pass');
    });
});
