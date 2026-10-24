import GameActions from '../../../server/game/GameActions/index.js';

describe('placing a character in its dead pile', function () {
    it('leaves play with attachment and duplicate consequences, without killing or discarding the character', function () {
        this.setupTest({
            player1: {
                inPlay: [
                    {
                        card: 'Eddard Stark (Core)',
                        dupes: 1,
                        attachments: ['Little Bird (Core)']
                    }
                ]
            }
        });
        const left = [];
        const killedOrDiscarded = [];
        this.game.on('onCardLeftPlay', (event) => left.push(event.card));
        this.game.on('onCharacterKilled', (event) => killedOrDiscarded.push(event.card));
        this.game.on('onCardDiscarded', (event) => killedOrDiscarded.push(event.card));
        this.game.resolveGameAction(GameActions.placeInDeadPile({ card: this.eddardStark }));
        this.game.continue();
        expect(this.eddardStark.location).toBe('dead pile');
        expect(this.littleBird.location).toBe('hand');
        expect(this.eddardStark.dupes).toHaveLength(0);
        expect(left).toContain(this.eddardStark);
        expect(killedOrDiscarded).not.toContain(this.eddardStark);
        expect(this.player1Object.discardPile).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
