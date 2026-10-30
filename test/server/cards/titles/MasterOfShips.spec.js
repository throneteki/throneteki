describe('Master of Ships', function () {
    beforeEach(function () {
        this.setupTest({
            gameFormat: 'melee',
            phase: 'plot',
            player1: { inPlay: ['Ranging Party'] },
            player2: { inPlay: ['House Maester', 'Steward at the Wall', 'Tumblestone Knight'] },
            player3: { inPlay: ['Winterfell Steward'] }
        });
        for (const player of [this.player1, this.player2, this.player3])
            player.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.selectTitle('Master of Ships');
        this.player2.selectTitle('Master of Laws');
        this.player3.selectTitle('Master of Coin');
        this.completeMarshalPhase();
    });

    for (const [type, opponent, claim, strength] of [
        ['Military', 'player2', 2, 6],
        ['Military', 'player3', 1, 6],
        ['Power', 'player2', 1, 5]
    ]) {
        it(
            'has claim ' +
                claim +
                ' and strength ' +
                strength +
                ' attacking ' +
                opponent +
                ' in ' +
                type,
            function () {
                this.player1.clickPrompt(type);
                this.player1.clickPrompt(opponent);
                expect(this.game.currentChallenge.attackerStrength).toBe(0);
                this.player1.clickCard(this.rangingParty);
                this.player1.clickPrompt('Done');
                expect(this.game.currentChallenge.attackerStrength).toBe(strength);
                expect(this.rangingParty.getStrength()).toBe(5);
                expect(this.player1Object.activePlot.getClaim()).toBe(claim);
                expect(this.player2Object.activePlot.getClaim()).toBe(1);
                expect(this.player3Object.activePlot.getClaim()).toBe(1);
                this.skipActionWindow();
                this[opponent].clickPrompt('Done');
                this.skipActionWindow();
                if (type === 'Military') {
                    if (opponent === 'player2') {
                        this.player2.clickCard(this.houseMaester);
                        this.player2.clickCard(this.stewardAtTheWall);
                        this.player2.clickPrompt('Done');
                        expect(this.player2).toHavePrompt(
                            'Select order to place cards in your dead pile (top first)'
                        );
                        this.player2.clickCard(this.houseMaester);
                        this.player2.clickCard(this.stewardAtTheWall);
                        this.player2.clickPrompt('Done');
                        expect(this.houseMaester.location).toBe('dead pile');
                        expect(this.stewardAtTheWall.location).toBe('dead pile');
                        expect(this.winterfellSteward.location).toBe('play area');
                    } else {
                        this.player3.clickCard(this.winterfellSteward);
                        expect(this.winterfellSteward.location).toBe('dead pile');
                        expect(this.houseMaester.location).toBe('play area');
                        expect(this.stewardAtTheWall.location).toBe('play area');
                    }
                }
                expect(this.player1Object.activePlot.getClaim()).toBe(1);
                expect(this.player1).isReadyToTakeAction();
            }
        );
    }
    it('contributes military strength while defending without raising claim', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickPrompt('player1');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.rangingParty);
        this.player1.clickPrompt('Done');
        expect(this.game.currentChallenge.attackerStrength).toBe(2);
        expect(this.game.currentChallenge.defenderStrength).toBe(6);
        expect(this.player1Object.activePlot.getClaim()).toBe(1);
        this.skipActionWindow();
        expect(this.player2).isReadyToTakeAction();
    });
});
