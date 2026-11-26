import GameActions from '../../../server/game/GameActions/index.js';

describe('PlaceCardUnderneath with a card in play', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Hedge Knight', attachments: ['Little Bird (Core)'] },
                    'Winterfell Steward'
                ]
            }
        });

        this.leftPlay = [];
        this.game.on('onCardLeftPlay', (event) => this.leftPlay.push(event.card));
        this.place = (props) => {
            this.game.resolveGameAction(
                GameActions.placeCardUnderneath({
                    player: this.player1Object,
                    facedown: true,
                    ...props
                })
            );
            this.game.continue();
        };
    });

    it('takes the card out of play before placing it facedown underneath', function () {
        this.place({ card: this.hedgeKnight, parentCard: this.winterfellSteward });

        expect(this.leftPlay).toContain(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('underneath');
        expect(this.hedgeKnight.facedown).toBe(true);
        expect(this.winterfellSteward.underneath).toEqual([this.hedgeKnight]);
        expect(this.player1Object.cardsInPlay).not.toContain(this.hedgeKnight);
        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('returns the attachments of the card to hand as it leaves play', function () {
        this.place({ card: this.hedgeKnight, parentCard: this.winterfellSteward });

        expect(this.littleBird.location).toBe('hand');
        expect(this.hedgeKnight.attachments).toEqual([]);
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot place a card underneath one of its own attachments', function () {
        const action = GameActions.placeCardUnderneath({
            player: this.player1Object,
            card: this.hedgeKnight,
            parentCard: this.littleBird
        });

        expect(action.allow()).toBe(false);
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
