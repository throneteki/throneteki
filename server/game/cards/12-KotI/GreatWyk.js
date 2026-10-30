import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreatWyk extends DrawCard {
    // Great Wyk (12017)
    // Reaction: After a character enters play from your dead pile, each opponent chooses and
    // discards 1 card from his or her hand. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.getType() === 'character' &&
                    event.card.controller === context.player &&
                    event.originalLocation === 'dead pile'
            },
            limit: ability.limit.perPhase(1),
            message:
                '{player} uses {source} to have each opponent choose and discard 1 card from their hand',
            gameAction: GameActions.chooseCards({
                players: (context) => context.game.getOpponents(context.player),
                title: 'Select a card to discard',
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.discardCard({ card })
            })
        });
    }
}

GreatWyk.code = '12017';

export default GreatWyk;
