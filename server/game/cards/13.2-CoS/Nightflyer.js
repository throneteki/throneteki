import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Nightflyer extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });

        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            cost: ability.costs.payXGold(
                () => this.minLocationCost(),
                () => this.maxLocationCost()
            ),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    (context.xValue === undefined || card.getPrintedCost() <= context.xValue),
                gameAction: 'discard'
            },
            message: {
                format: '{player} uses {source} and pays {xValue} gold to discard {target} from play',
                args: {
                    xValue: (context) => context.xValue
                }
            },
            handler: (context) => {
                this.game.resolveGameAction(GameActions.discardCard({ card: context.target }));
            }
        });
    }

    minLocationCost() {
        return Math.min(...this.getLocationCosts());
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
