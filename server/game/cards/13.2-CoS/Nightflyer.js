import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Nightflyer extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            initiative: 1
        });

        this.xValue({ min: () => 0, max: () => this.maxLocationCost() });

        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    card.getPrintedCost() <= context.event.xValue,
                gameAction: 'discard'
            },
            message: {
                format: '{player} uses {source} and pays {xValue} gold to discard {target} from play',
                args: {
                    xValue: (context) => context.event.xValue
                }
            },
            handler: (context) => {
                this.game.resolveGameAction(GameActions.discardCard({ card: context.target }));
            }
        });
    }

    maxLocationCost() {
        return Math.max(...this.getLocationCosts());
    }

    getLocationCosts() {
        let locations = this.game.filterCardsInPlay((card) => card.getType() === 'location');
        return locations.map((location) => location.getPrintedCost());
    }
}

Nightflyer.code = '13032';

export default Nightflyer;
