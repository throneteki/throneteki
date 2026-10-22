describe('The Seven-Pointed Star', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [{ card: 'Hedge Knight', attachments: ['The Seven-Pointed Star'] }],
                hand: ['Baelor Blacktyde']
            }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.theSevenPointedStar);
        this.player1.clickCard(this.baelorBlacktyde);
    });

    it('kneels the attached character to reduce the cost of the next The Seven card by 2', function () {
        expect(this.hedgeKnight.hasTrait('The Seven')).toBe(true);
        expect(this.hedgeKnight.kneeled).toBe(true);
        expect(this.baelorBlacktyde.location).toBe('play area');
        expect(this.player1Object.gold).toBe(this.startingGold - 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
