const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class Nightflyer extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });

        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card === this
            },
            cost: ability.costs.payXGold(() => this.minLocationCost(), () => this.maxLocationCost()),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) => card.location === 'play area' && card.getType() === 'location' && (context.xValue === undefined || card.getPrintedCost() <= context.xValue),
                gameAction: 'discard'
            },
            message: '{player} uses {source} to discard {target} from play',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.discardCard({ card: context.target, player: context.player })
                );
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
        let locations = this.game.filterCardsInPlay(card => card.getType() === 'location');
        return locations.map(location => location.getPrintedCost());
    }
}

Nightflyer.code = '13032';

module.exports = Nightflyer;
