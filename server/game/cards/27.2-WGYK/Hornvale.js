import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Hornvale extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents([{ 'onCardLeftPlay:forcedinterrupt': 'onCardLeftPlay' }]);
    }

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === this.controller
            },
            cost: ability.costs.kneelSelf(),

            target: {
                choosingPlayer: (player, context) => player === context.event.challenge.loser,
                activePromptTitle: 'Select a card',
                cardCondition: { location: 'hand', controller: 'choosingPlayer' }
            },
            message: {
                format: '{player} kneels {source} to have {loser} place a card from their hand facedown under {source}',
                args: {
                    loser: (context) => context.event.challenge.loser
                }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.placeCardUnderneath({
                        card: context.target,
                        parentCard: this,
                        facedown: true
                    }),
                    context
                );
            }
        });
    }

    onCardLeftPlay(event) {
        if (event.card !== this || this.underneath.length === 0) {
            return;
        }

        const cards = [...this.underneath];

        this.game.addMessage(
            "{0} returns {1} to their owner's hand due to {2} leaving play",
            this.controller,
            cards,
            this
        );

        this.game.resolveGameAction(
            GameActions.simultaneously(cards.map((card) => GameActions.returnCardToHand({ card })))
        );
    }
}

Hornvale.code = '27026';

export default Hornvale;
