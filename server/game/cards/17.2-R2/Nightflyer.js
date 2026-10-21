import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Nightflyer extends DrawCard {
    // Nightflyer (17164)
    // Shadow (X).
    // Reaction: After Nightflyer comes out of shadows, choose a non-limited location with printed
    // cost X or lower and discard it from play.
    // +1 Initiative.
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
                    !card.isLimited() &&
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

Nightflyer.code = '17164';

export default Nightflyer;
