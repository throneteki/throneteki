describe('All the Gold in Casterly Rock', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Cersei Lannister (Core)'],
                shadows: ['All the Gold in Casterly Rock', 'Undercity Spymaster']
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);
        this.startingGold = this.player1Object.gold;
        this.player1.triggerAbility(this.allTheGoldInCasterlyRock);
    });

    it('gains 2 gold for each card you control in shadows after you win an intrigue challenge', function () {
        expect(this.player1Object.gold).toBe(this.startingGold + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
