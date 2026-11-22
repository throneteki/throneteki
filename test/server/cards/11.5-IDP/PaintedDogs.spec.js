describe('Painted Dogs', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: [
                    'Painted Dogs',
                    'Tumblestone Knight',
                    { card: 'Burned Men', kneeling: true }
                ]
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.paintedDogs);
        this.player1.clickCard(this.burnedMen);
    });

    it('returns itself to your hand to stand a Clansman character or Tyrion Lannister', function () {
        expect(this.paintedDogs.location).toBe('hand');
        expect(this.burnedMen.kneeled).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});

describe('Painted Dogs when it is the only kneeling Clansman', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: [{ card: 'Painted Dogs', kneeling: true }, 'Tumblestone Knight']
            }
        });
        this.game.cardClicked(this.player1.name, this.paintedDogs.uuid);
        this.game.continue();
    });

    // Rules FAQ: "you can still trigger and return it to hand (because there is an eligible
    // target present when the check is made)".
    it('can still be used to return it to hand', function () {
        expect(this.player1).toHavePrompt('Use Painted Dogs?');
        expect(this.player1).toBeAbleToSelect(this.paintedDogs);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickPrompt('Stand Clansman or Tyrion');

        expect(this.paintedDogs.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
