import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OldGreyGull extends DrawCard {
    // Old Grey Gull (12011)
    // Action: Kneel Old Grey Gull to kill another [greyjoy] character you control. Then, you may
    // return that character from your dead pile to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill and return character',
            cost: ability.costs.kneelSelf(),
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card !== context.source &&
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('greyjoy') &&
                    card.controller === context.player
            },
            message: '{player} kneels {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target })).then({
                gameAction: GameActions.may({
                    title: (context) => `Return ${context.parentContext.target.name} to hand?`,
                    message: {
                        format: 'Then {player} returns {character} to their hand',
                        args: { character: (context) => context.parentContext.target }
                    },
                    gameAction: GameActions.returnCardToHand((context) => ({
                        card: context.parentContext.target
                    }))
                })
            })
        });
    }
}

OldGreyGull.code = '12011';

export default OldGreyGull;
