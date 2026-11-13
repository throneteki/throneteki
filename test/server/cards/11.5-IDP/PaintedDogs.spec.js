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
    });

    it('cannot be used, since returning it to hand removes its only target', function () {
        expect(this.player1.actionUnavailableReason(this.paintedDogs)).toBe('target');
        expect(this.paintedDogs.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Painted Dogs when it and another Clansman are kneeling', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: [
                    { card: 'Painted Dogs', kneeling: true },
                    { card: 'Burned Men', kneeling: true }
                ]
            }
        });
        this.game.cardClicked(this.player1.name, this.paintedDogs.uuid);
        this.game.continue();
    });

    it('only shows and offers the other Clansman', function () {
        expect(this.player1).toHavePrompt('Use Painted Dogs?');
        expect(this.player1).toBeAbleToSelect(this.burnedMen);
        expect(this.player1).not.toBeAbleToSelect(this.paintedDogs);

        this.player1.clickPrompt('Stand Clansman or Tyrion');

        expect(this.paintedDogs.location).toBe('hand');
        expect(this.player1).toBeAbleToSelect(this.burnedMen);

        this.player1.clickCard(this.burnedMen);

        expect(this.burnedMen.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
