describe('Fresh Recruits', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Fresh Recruits'],
                drawDeck: [
                    'Ranging Party',
                    'Sworn Brother',
                    'Steward at the Wall',
                    'Tumblestone Knight'
                ]
            }
        });

        this.player1.clickCard(this.freshRecruits);
    });

    it('searches your deck for a Ranger, a Builder and a Steward character and adds them to your hand', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.rangingParty);
        this.player1.clickCard(this.swornBrother);
        this.player1.clickCard(this.stewardAtTheWall);
        this.player1.clickPrompt('Done');

        expect(this.rangingParty.location).toBe('hand');
        expect(this.swornBrother.location).toBe('hand');
        expect(this.stewardAtTheWall.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
