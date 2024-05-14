import DrawCard from '../../drawcard.js';

class JadeSeaDromond extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });

        this.action({
            title: 'Discard location',
            phase: 'dominance',
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    !card.isLimited() &&
                    card.getType() === 'location' &&
                    card.getPrintedCost() <= 3,
                gameAction: 'discard'
            },
            handler: (context) => {
                context.target.controller.discardCard(context.target);
                this.game.addMessage(
                    '{0} kneels and sacrifices {1} to discard {2} from play',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

JadeSeaDromond.code = '10042';

export default JadeSeaDromond;
