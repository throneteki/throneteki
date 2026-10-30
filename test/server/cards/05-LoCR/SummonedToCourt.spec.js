describe('Summoned to Court', function () {
    function setup(context, hand1, hand2) {
        context.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Summoned to Court'], hand: hand1 },
            player2: { hand: hand2 }
        });
        context.player1.selectPlot('Summoned to Court');
        context.player2.selectPlot('Filler Plot');
        context.selectFirstPlayer(context.player2);
    }

    it('keeps choices secret and offers only the lowest-cost revealed character', function () {
        setup(this, ['Balon Greyjoy (Core)'], ['Aeron Damphair (Core)']);
        expect(this.player2).toBeAbleToSelect(this.aeronDamphair);
        expect(this.player2).not.toBeAbleToSelect(this.balonGreyjoy);
        this.player2.clickCard(this.aeronDamphair);
        expect(this.game.cardVisibility.isVisible(this.aeronDamphair, this.player1Object)).toBe(
            false
        );
        expect(this.player1).toBeAbleToSelect(this.balonGreyjoy);
        expect(this.player1).not.toBeAbleToSelect(this.aeronDamphair);
        this.player1.clickCard(this.balonGreyjoy);
        expect(this.player2).toHavePrompt('Put Aeron Damphair into play?');
        expect(this.player1).not.toHavePrompt('Put Balon Greyjoy into play?');
        this.player2.clickPrompt('Yes');
        expect(this.aeronDamphair.location).toBe('play area');
        expect(this.balonGreyjoy.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });

    it('offers both characters when their printed costs tie', function () {
        setup(this, ['Ranging Party'], ['Cersei Lannister (Core)']);
        this.player2.clickCard(this.cerseiLannister);
        this.player1.clickCard(this.rangingParty);
        this.player2.clickPrompt('Yes');
        this.player1.clickPrompt('Yes');
        expect(this.cerseiLannister.location).toBe('play area');
        expect(this.rangingParty.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });

    it('compares only characters even when a cheaper non-character is revealed', function () {
        setup(this, ['Balon Greyjoy (Core)'], ['The Roseroad']);
        this.player2.clickCard(this.theRoseroad);
        this.player1.clickCard(this.balonGreyjoy);
        this.player1.clickPrompt('Yes');
        expect(this.balonGreyjoy.location).toBe('play area');
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });

    it('allows the eligible player to decline putting the character into play', function () {
        setup(this, ['Balon Greyjoy (Core)'], ['Aeron Damphair (Core)']);
        this.player2.clickCard(this.aeronDamphair);
        this.player1.clickCard(this.balonGreyjoy);
        this.player2.clickPrompt('No');
        expect(this.aeronDamphair.location).toBe('hand');
        expect(this.balonGreyjoy.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });

    it('offers neither player a character when both reveal non-characters', function () {
        setup(this, ['Rose Garden'], ['The Roseroad']);
        this.player2.clickCard(this.theRoseroad);
        this.player1.clickCard(this.roseGarden);
        expect(this.roseGarden.location).toBe('hand');
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});

describe('Summoned to Court with empty hands', function () {
    for (const bothEmpty of [false, true]) {
        it(
            bothEmpty
                ? 'skips both players when neither has cards'
                : 'skips the empty hand and resolves the other player',
            function () {
                this.setupTest({
                    phase: 'plot',
                    player1: {
                        plotDeck: ['Summoned to Court'],
                        hand: [bothEmpty ? 'Qotho (HoT)' : 'Balon Greyjoy (Core)'],
                        drawDeck: ['Dragon Sight', 'Deadly Khalasar']
                    },
                    player2: { hand: ['Qotho (HoT)'], drawDeck: ['Dracarys!', 'Fire and Blood'] }
                });
                this.player1.togglePromptedActionWindow('draw', true);
                this.player2.togglePromptedActionWindow('draw', true);
                this.player1.selectPlot('Summoned to Court');
                this.player2.selectPlot('Filler Plot');
                this.selectFirstPlayer(this.player2);
                const qotho2 = this.player2.findCardByName('Qotho', 'hand');
                this.player2.clickCard(qotho2);
                this.player2.clickCard(this.dracarys);
                this.player2.clickCard(this.fireAndBlood);
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                expect(this.player2Object.hand).toHaveLength(0);
                if (bothEmpty) {
                    const qotho1 = this.player1.findCardByName('Qotho', 'hand');
                    this.player1.clickCard(qotho1);
                    this.player1.clickCard(this.dragonSight);
                    this.player1.clickCard(this.deadlyKhalasar);
                    this.player1.clickPrompt('Done');
                    this.player1.clickPrompt('Done');
                    expect(this.player1Object.hand).toHaveLength(0);
                    this.player2.clickPrompt('Pass');
                    this.player1.clickPrompt('Pass');
                } else {
                    this.player1.clickPrompt('Pass');
                    this.player2.clickPrompt('Pass');
                    expect(this.player2).not.toHavePrompt('Choose a card to reveal');
                    this.player1.clickCard(this.balonGreyjoy);
                    this.player1.clickPrompt('Yes');
                    expect(this.balonGreyjoy.location).toBe('play area');
                }
                expect(this.player2).isReadyToTakeAction();
            }
        );
    }
});
