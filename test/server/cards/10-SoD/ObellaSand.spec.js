describe('Obella Sand', function () {
    function setup(context, obella) {
        context.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', [obella]: ['Obella Sand'] },
            player2: {
                faction: 'martell',
                inPlay: ['House Dayne Knight'],
                power: 1
            }
        });
        context.player1.clickPrompt('Done');
    }

    it('moves 1 power from the winning opponent and shuffles itself into your deck after being killed for military claim', function () {
        setup(this, 'inPlay');
        this.unopposedChallenge(this.player2, 'Military', this.houseDayneKnight);
        this.player1.clickCard(this.obellaSand);
        this.player1.triggerAbility('Obella Sand');
        expect(this.obellaSand.location).toBe('draw deck');
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.player2Object.faction.power).toBe(1);
    });

    it('moves 1 power from the winning opponent and shuffles itself into your deck after being discarded for intrigue claim', function () {
        setup(this, 'hand');
        this.unopposedChallenge(this.player2, 'Intrigue', this.houseDayneKnight);
        this.player1.triggerAbility('Obella Sand');
        expect(this.obellaSand.location).toBe('draw deck');
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.player2Object.faction.power).toBe(1);
    });
});

describe('Obella Sand killed for claim satisfied after the challenges', function () {
    it("moves power from the player whose claim it was (Maester Aemon's controller)", function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { power: 2, inPlay: ['Maester Aemon (WotW)'] },
            player2: { faction: 'martell', inPlay: ['Obella Sand'] }
        });
        this.player2.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility('Maester Aemon');
        this.player1.clickPrompt('Military');
        this.player2.clickCard(this.obellaSand);
        this.player2.triggerAbility(this.obellaSand);

        expect(this.game.getPlainTextLog()).toContain('1 power from House Stark to House Martell');
        expect(this.player2Object.faction.power).toBe(1);
        expect(this.obellaSand.location).toBe('draw deck');
    });
});
