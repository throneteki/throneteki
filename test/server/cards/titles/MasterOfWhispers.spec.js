describe('Master of Whispers', function () {
    beforeEach(function () {
        this.setupTest({
            gameFormat: 'melee',
            phase: 'plot',
            player1: { inPlay: ['House Maester'] },
            player2: { hand: ['The Roseroad'], inPlay: ['Greenblood Trader'] },
            player3: { hand: ['Rose Garden'] }
        });
        for (const player of [this.player1, this.player2, this.player3])
            player.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.selectTitle('Master of Whispers');
        this.player2.selectTitle('Master of Coin');
        this.player3.selectTitle('Master of Laws');
        this.completeMarshalPhase();
    });

    for (const recipients of [[], ['player3'], ['player2', 'player3']]) {
        it('applies intrigue claim to ' + (recipients.join(' and ') || 'nobody'), function () {
            this.player1.clickPrompt('Intrigue');
            this.player1.clickPrompt('player2');
            expect(this.game.currentChallenge.attackerStrength).toBe(0);
            this.player1.clickCard(this.houseMaester);
            this.player1.clickPrompt('Done');
            expect(this.game.currentChallenge.attackerStrength).toBe(3);
            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            expect(this.player1).toHavePromptButton('player2');
            expect(this.player1).toHavePromptButton('player3');
            expect(this.player1).not.toHavePromptButton('player1');
            for (const recipient of recipients) this.player1.clickPrompt(recipient);
            if (recipients.length < 2) this.player1.clickPrompt('Done');
            expect(this.player1Object.discardPile).toHaveLength(0);
            expect(this.player2Object.discardPile).toHaveLength(
                recipients.includes('player2') ? 1 : 0
            );
            expect(this.player3Object.discardPile).toHaveLength(
                recipients.includes('player3') ? 1 : 0
            );
            expect(this.player1).isReadyToTakeAction();
        });
    }

    it('contributes intrigue strength while defending without applying claim', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Intrigue');
        this.player2.clickPrompt('player1');
        this.player2.clickCard(this.greenbloodTrader);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.houseMaester);
        this.player1.clickPrompt('Done');
        expect(this.game.currentChallenge.attackerStrength).toBe(1);
        expect(this.game.currentChallenge.defenderStrength).toBe(3);
        this.skipActionWindow();
        expect(this.player2Object.discardPile).toHaveLength(0);
        expect(this.player3Object.discardPile).toHaveLength(0);
        expect(this.player2).isReadyToTakeAction();
    });

    it('does not grant strength or intrigue claim effects in a power challenge', function () {
        this.player1.clickPrompt('Power');
        this.player1.clickPrompt('player2');
        this.player1.clickCard(this.houseMaester);
        this.player1.clickPrompt('Done');
        expect(this.game.currentChallenge.attackerStrength).toBe(2);
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player2Object.discardPile).toHaveLength(0);
        expect(this.player3Object.discardPile).toHaveLength(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
