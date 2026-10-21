import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Hornvale extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents([{ 'onCardLeftPlay:forcedinterrupt': 'onCardLeftPlay' }]);
    }

    // Hornvale (27026)
    // Reaction: After you win an [intrigue] challenge, kneel Hornvale to have the losing opponent
    // choose a card in their hand and place it facedown under Hornvale. If Hornvale leaves play,
    // return each card under it to its owner's hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === context.source.controller
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
            gameAction: GameActions.placeCardUnderneath((context) => ({
                card: context.target,
                parentCard: context.source,
                facedown: true
            }))
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
