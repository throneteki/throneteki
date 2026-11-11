describe('Howland Reed', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Howland Reed'],
                shadows: ['Meera Reed (R)']
            }
        });
    });

    it('reduces the cost of the first [stark] card you bring out of shadows each round by 2', function () {
        this.player1.clickCard(this.meeraReed);

        expect(this.meeraReed.location).toBe('play area');
        expect(this.player1Object.gold).toBe(5);

        this.player1.clickPrompt('Pass');

        expect(this.player1).isReadyToTakeAction();
    });
});
