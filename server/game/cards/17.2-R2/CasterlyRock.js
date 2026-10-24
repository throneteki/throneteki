import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class CasterlyRock extends DrawCard {
    // Casterly Rock (17166)
    // While Casterly Rock is standing, you may spend gold on [lannister] cards you control as if it
    // were in your gold pool during the marshaling phase.
    // Marshaling Action: Kneel Casterly Rock to choose up to 3 [lannister] cards. Each of those
    // cards gains 1 gold.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.currentPhase === 'marshal' && !context.source.kneeled,
            match: (card, context) =>
                card.controller === context.source.controller &&
                card.location === 'play area' &&
                card.isFaction('lannister'),
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
                cardCondition: (card) =>
                    card.location === 'play area' && card.isFaction('lannister')
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

CasterlyRock.code = '17166';

export default CasterlyRock;
