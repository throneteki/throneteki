describe('Baelor Blacktyde', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Baelor Blacktyde'] },
            player2: { hand: ['Nightmares', 'Consolidation of Power'], discard: ['Nightmares'] }
        });
        [this.nightmaresInHand] = this.player2.filterCardsByName('Nightmares', 'hand');
    });

    it('stops each opponent playing copies of events that are in their discard pile', function () {
        expect(this.player2Object.canPlay(this.nightmaresInHand)).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not stop them playing other cards', function () {
        expect(this.player2Object.canPlay(this.consolidationOfPower)).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
