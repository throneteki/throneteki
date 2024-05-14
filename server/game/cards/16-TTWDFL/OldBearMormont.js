import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OldBearMormont extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand character',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card !== this &&
                    card.kneeled &&
                    (card.isMatch({ faction: 'thenightswatch' }) ||
                        card.isMatch({ trait: 'Lord' })),
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard((context) => ({
                        card: context.target
                    })),
                    context
                );
            }
        });

        this.reaction({
            when: {
                onCharacterKilled: (event) => event.card.controller === this.controller
            },
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard({ card: this })
        });
    }
}

OldBearMormont.code = '16010';

export default OldBearMormont;
