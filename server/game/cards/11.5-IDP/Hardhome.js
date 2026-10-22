import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Hardhome extends DrawCard {
    // Hardhome (11086)
    // Shadow (2).
    // Dominance Action: Kneel and sacrifice Hardhome to choose an opponent. That player sacrifices
    // a standing character.
    setupCardAbilities(ability) {
        this.action({
            title: 'Force opponent to sacrifice',
            phase: 'dominance',
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            chooseOpponent: true,
            message:
                '{player} kneels and sacrifices {source} to have {opponent} sacrifice a standing character',
            gameAction: GameActions.chooseCards({
                player: (context) => context.opponent,
                title: 'Select a character to sacrifice',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled &&
                    card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.sacrificeCard({ card })
            })
        });
    }
}

Hardhome.code = '11086';

export default Hardhome;
