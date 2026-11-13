import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

const InPlayLocations = ['active plot', 'faction', 'play area'];

class CasterlyRock extends DrawCard {
    // Casterly Rock (22008)
    // While Casterly Rock is standing, you may spend gold on [lannister] cards you control as if it
    // were in your gold pool.
    // Marshaling Action: Kneel Casterly Rock to choose up to 3 cards. Each of those cards gains 1
    // gold.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.kneeled,
            match: (card, context) =>
                card.controller === context.source.controller &&
                isInPlay(card) &&
                card.isFaction('lannister'),
            targetLocation: InPlayLocations,
            effect: ability.effects.canSpendGold(
                (spendParams, context) => spendParams.activePlayer === context.source.controller
            )
        });
        this.action({
            title: 'Select cards to gain gold',
            cost: ability.costs.kneelSelf(),
            phase: 'marshal',
            target: {
                mode: 'upTo',
                numCards: 3,
                activePromptTitle: 'Select up to 3 cards',
                cardType: ['attachment', 'character', 'faction', 'location', 'plot'],
                cardCondition: (card) => isInPlay(card)
            },
            message: '{player} kneels {source} to have {target} each gain 1 gold',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) =>
                    GameActions.placeToken({ card, token: Tokens.gold, amount: 1 })
                )
            )
        });
    }
}

function isInPlay(card) {
    return InPlayLocations.includes(card.location);
}

CasterlyRock.code = '22008';

export default CasterlyRock;
