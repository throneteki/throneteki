describe('The Power of Wealth', function () {
    it('names a faction and discounts only the first in-faction marshal each round', function () {
        this.setupTest({
            player1: {
                agenda: 'The Power of Wealth',
                faction: 'stark',
                hand: ['House Maester', 'Tumblestone Knight', 'Winterfell Steward'],
                gold: 6
            },
            player2: { hand: ['Tumblestone Knight'], gold: 2 },
            beforeMulligan() {
                this.player1.clickPrompt('Martell');
            }
        });
        const opponentKnight = this.player2.findCardByName('Tumblestone Knight', 'hand');
        expect(this.thePowerOfWealth.namedFactions).toEqual(['martell']);
        this.player1.clickCard(this.houseMaester);
        expect(this.player1Object.gold).toBe(4);
        this.player1.clickCard(this.player1.findCardByName('Tumblestone Knight', 'hand'));
        expect(this.player1Object.gold).toBe(3);
        this.player1.clickCard(this.winterfellSteward);
        expect(this.player1Object.gold).toBe(2);
        this.player1.clickPrompt('Done');
        this.player2.clickCard(opponentKnight);
        expect(this.player2Object.gold).toBe(5);
        expect(opponentKnight.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });

    it('can use the discount to play an in-faction event instead of marshaling', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'The Power of Wealth',
                inPlay: ['House Maester'],
                hand: ['Winter Is Coming'],
                gold: 0
            },
            beforeMulligan() {
                this.player1.clickPrompt('Greyjoy');
            }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.houseMaester);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.winterIsComing);
        expect(this.winterIsComing.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1Object.getClaim()).toBe(2);
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).isReadyToTakeAction();
    });

    it('refreshes the first-card discount in the next round', function () {
        this.setupTest({
            player1: {
                agenda: 'The Power of Wealth',
                hand: ['Tumblestone Knight', 'Winterfell Steward'],
                gold: 5
            },
            beforeMulligan() {
                this.player1.clickPrompt('Tyrell');
            }
        });
        this.player1.clickCard(this.tumblestoneKnight);
        expect(this.player1Object.gold).toBe(4);
        this.completeRound();
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.winterfellSteward);
        expect(this.player1Object.gold).toBe(5);
        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
