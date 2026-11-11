describe('Fury', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Fury', 'Stannis Baratheon (FotS)'] },
            player2: { inPlay: [{ card: 'Hot Pie (FFH)', power: 1 }] }
        });
        expect(this.stannisBaratheon.hasKeyword('intimidate')).toBe(true);
        this.unopposedChallenge(this.player1, 'Power', this.stannisBaratheon);
        this.factionPower = this.player1Object.faction.power;
        this.player1.triggerAbility(this.fury);
        this.player1.clickCard(this.hotPie);
    });

    it('gives Stannis Baratheon intimidate, and kneels to move 1 power from a character or location to your faction card after you win a power challenge', function () {
        expect(this.fury.kneeled).toBe(true);
        expect(this.hotPie.power).toBe(0);
        expect(this.player1Object.faction.power).toBe(this.factionPower + 1);

        this.player1.clickPrompt('Pass');
        this.player1.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
    });
});
