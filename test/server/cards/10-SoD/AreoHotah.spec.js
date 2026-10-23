describe('Areo Hotah (SoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Areo Hotah (SoD)'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.areoHotah);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.areoHotah);
    });

    it('returns to your hand to raise your claim by 1 until the end of the phase after you win a challenge he defends in', function () {
        expect(this.areoHotah.location).toBe('hand');
        expect(this.player1Object.activePlot.getClaim()).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});

describe('Areo Hotah (SoD) ambush discount', function () {
    const plots = [
        'A Noble Cause',
        'Sneak Attack',
        'Counting Coppers',
        'Trading with the Pentoshi',
        'Famine',
        'The Long Winter'
    ];
    for (const count of [0, 1, 5, 6]) {
        it('reduces ambush cost for ' + count + ' used plots', function () {
            this.setupTest({
                phase: 'challenge',
                player1: { hand: ['Areo Hotah (SoD)'], usedPlots: plots.slice(0, count), gold: 10 },
                player2: { usedPlots: ['City of Secrets'] }
            });
            this.player1.clickCard(this.areoHotah);
            expect(this.areoHotah.location).toBe('play area');
            expect(this.player1Object.gold).toBe(4 + count);
            expect(this.player1).isReadyToTakeAction();
        });
    }
});
