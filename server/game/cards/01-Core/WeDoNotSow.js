import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WeDoNotSow extends DrawCard {
    // We Do Not Sow (01083)
    // Reaction: After you win an unopposed challenge, choose an attachment or location controlled
    // by the losing opponent, and discard it from play. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.isUnopposed()
            },
            target: {
                activePromptTitle: 'Select attachment or location',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.game.currentChallenge.loser &&
                    (card.getType() === 'attachment' || card.getType() === 'location'),
                gameAction: 'discard'
            },
            message: '{player} plays {source} to discard {target} from play',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

WeDoNotSow.code = '01083';

export default WeDoNotSow;
