describe('Samwell Tarly (BtB)', function () {
    it('draws 1 card after you win a challenge he is in with 6 or more reserve', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Samwell Tarly (BtB)'], drawDeck: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.samwellTarly);
        this.player1.triggerAbility('Samwell Tarly');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player1Object.faction.power).toBe(1);
    });

    it('also gains 1 power at 8 or more, and stands a character that shares a Trait with him at 10 or more', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Counting Coppers',
                inPlay: ['Samwell Tarly (BtB)', { card: 'Winterfell Steward', kneeling: true }]
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.samwellTarly);
        this.player1.triggerAbility('Samwell Tarly');
        this.player1.clickCard(this.winterfellSteward);
        expect(this.player1Object.faction.power).toBe(2);
        expect(this.winterfellSteward.kneeled).toBe(false);
    });
});
