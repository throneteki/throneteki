import AbilityContext from '../../server/game/AbilityContext.js';
import Effects from '../../server/game/effects.js';
import GameActions from '../../server/game/GameActions/index.js';

describe('event checks', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight', 'House Dayne Knight'],
                hand: ['Hedge Knight']
            }
        });

        this.drawWhenKneeled = (card) =>
            card.eventCheck({
                when: { onCardKneeled: (event, context) => event.card === context.source },
                message: '{player} draws 1 card for {source}',
                gameAction: GameActions.drawCards((context) => ({
                    player: context.player,
                    amount: 1
                }))
            });
        this.declareAttacker = (card) => {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(card);
            this.player1.clickPrompt('Done');
        };
    });

    it('resolves without a prompt when its event occurs', function () {
        this.drawWhenKneeled(this.tumblestoneKnight);

        this.declareAttacker(this.tumblestoneKnight);

        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.game.getPlainTextLog()).toContain(
            'player1 draws 1 card for Tumblestone Knight'
        );
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not resolve while its card is not in play', function () {
        this.drawWhenKneeled(this.hedgeKnight);

        this.declareAttacker(this.tumblestoneKnight);

        expect(this.player1Object.hand).toHaveLength(1);
    });

    it('does not resolve while its card is blank', function () {
        this.drawWhenKneeled(this.tumblestoneKnight);
        this.game.resolveGameAction(
            GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                match: this.tumblestoneKnight,
                effect: Effects.blankExcludingTraits
            })),
            new AbilityContext({
                game: this.game,
                player: this.player1Object,
                source: this.houseDayneKnight
            })
        );
        this.game.continue();

        this.declareAttacker(this.tumblestoneKnight);

        expect(this.player1Object.hand).toHaveLength(1);
    });
});
