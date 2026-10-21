import DrawCard from '../../drawcard.js';

class TheShadowCity extends DrawCard {
    // The Shadow City (11017)
    // Shadow (2).
    // Reduce the cost to marshal each of your cards into shadows by 1.
    // Challenges Action: Kneel The Shadow City and discard 1 card from shadows to draw 2 cards.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'marshalIntoShadows',
                amount: 1
            })
        });
        this.action({
            title: 'Draw 2 cards',
            phase: 'challenge',
            condition: () => this.controller.canDraw(),
            cost: [ability.costs.kneelSelf(), ability.costs.discardFromShadows()],
            handler: (context) => {
                let numOfCardsDrawn = this.controller.drawCardsToHand(2).length;
                this.game.addMessage(
                    '{0} kneels {1} and discards {2} from shadows to draw {3} cards',
                    this.controller,
                    this,
                    context.costs.discardFromShadows,
                    numOfCardsDrawn
                );
            }
        });
    }
}

TheShadowCity.code = '11017';

export default TheShadowCity;
