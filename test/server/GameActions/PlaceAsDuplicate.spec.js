import AbilityContext from '../../../server/game/AbilityContext.js';
import GameActions from '../../../server/game/GameActions/index.js';

describe('placeAsDuplicate game action', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Hedge Knight'],
                inPlay: ['Tumblestone Knight']
            }
        });

        this.context = new AbilityContext({
            game: this.game,
            player: this.player1Object,
            source: this.tumblestoneKnight
        });
        this.place = (props) => {
            const action = GameActions.placeAsDuplicate(props);
            this.game.addMessage('{0}', action.message(this.context));
            this.game.resolveGameAction(action, this.context);
            this.game.continue();
        };
    });

    it('places the card on the parent as a duplicate', function () {
        this.place({ card: this.hedgeKnight, parent: this.tumblestoneKnight });

        expect(this.tumblestoneKnight.dupes).toContain(this.hedgeKnight);
        expect(this.hedgeKnight.facedown).toBe(false);
        expect(this.game.getPlainTextLog()).toContain(
            'places Hedge Knight on Tumblestone Knight as a duplicate'
        );
    });

    it('does not name a card placed facedown', function () {
        this.place({ card: this.hedgeKnight, parent: this.tumblestoneKnight, facedown: true });

        expect(this.tumblestoneKnight.dupes).toContain(this.hedgeKnight);
        expect(this.hedgeKnight.facedown).toBe(true);
        expect(this.game.getPlainTextLog()).toContain(
            'places a facedown card on Tumblestone Knight as a duplicate'
        );
        expect(this.game.getPlainTextLog()).not.toContain('Hedge Knight');
    });
});
