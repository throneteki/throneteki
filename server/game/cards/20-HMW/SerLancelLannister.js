import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SerLancelLannister extends DrawCard {
    // Ser Lancel Lannister (20011)
    // Power on Lord or Lady characters does not count towards their controllers' power total.
    // Action: Kneel Ser Lancel Lannister to put Warrior's Sons into play from your hand or discard
    // pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: () => true,
            match: (card) =>
                (card.hasTrait('Lord') || card.hasTrait('Lady')) && card.getType() === 'character',
            effect: ability.effects.doesNotContributeToPowerTotal()
        });

        this.action({
            title: "Put Warrior's Sons into play",
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    context.player === card.controller &&
                    card.name === "Warrior's Sons" &&
                    ['hand', 'discard pile'].includes(card.location) &&
                    context.player.canPutIntoPlay(card)
            },
            message: {
                format: '{player} uses {source} to put {target} into play from their {location}',
                args: { location: (context) => context.target.location }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

SerLancelLannister.code = '20011';

export default SerLancelLannister;
