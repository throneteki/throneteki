describe('Orton Merryweather', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Orton Merryweather (THBIB)']
            },
            player2: {
                inPlay: ['Stannis Baratheon (FotS)', 'House Maester']
            }
        });
    });

    it('adds your gold to your total for dominance again', function () {
        expect(this.player1Object.gold).toBe(5);
        expect(this.player2Object.gold).toBe(5);
        expect(this.ortonMerryweather.getDominanceStrength()).toBe(9);
        expect(this.player1Object.getDominance()).toBe(14);
        expect(this.player2Object.getDominance()).toBe(14);
        expect(this.player1).isReadyToTakeAction();
    });

    describe('when dominance is determined and you have not lost an intrigue challenge', function () {
        beforeEach(function () {
            this.completeChallengesPhase();
        });

        it('gains 2 gold, which counts toward that dominance', function () {
            this.player1.triggerAbility(this.ortonMerryweather);

            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Orton Merryweather to gain 2 gold'
            );
            expect(this.game.getPlainTextLog()).toContain('player1 has 18 for dominance');
            expect(this.game.winnerOfDominanceInLastRound).toBe(this.player1Object);
            expect(this.player1Object.faction.power).toBe(1);
            expect(this.player1).toHavePrompt('Select a plot');
        });
    });

    describe('when you have lost an intrigue challenge this round', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Intrigue', this.houseMaester);
            this.player2.clickPrompt('Done');
        });

        it('does not gain the gold', function () {
            expect(this.game.getPlainTextLog()).not.toContain(
                'uses Orton Merryweather to gain 2 gold'
            );
            expect(this.game.getPlainTextLog()).toContain(
                'player1 returns 5 unspent gold to the treasury'
            );
            expect(this.player1).toHavePrompt('Select a plot');
        });
    });
});
