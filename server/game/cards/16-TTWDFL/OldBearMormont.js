import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OldBearMormont extends DrawCard {
    // Old Bear Mormont (16010)
    // Action: Kneel Old Bear Mormont to choose and stand another [thenightswatch] or Lord
    // character.
    // Reaction: After a character you control is killed, stand Old Bear Mormont.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand character',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card !== context.source &&
                    card.kneeled &&
                    (card.isMatch({ faction: 'thenightswatch' }) ||
                        card.isMatch({ trait: 'Lord' })),
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({
                card: context.target
            }))
        });

        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    event.card.controller === context.source.controller
            },
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard({ card: this })
        });
    }
}

OldBearMormont.code = '16010';

export default OldBearMormont;
