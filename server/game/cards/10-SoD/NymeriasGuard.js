import DrawCard from '../../drawcard.js';

class NymeriasGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: "Put Nymeria's Guard into play",
            location: 'hand',
            phase: 'challenge',
            condition: () => this.controller.canPutIntoPlay(this),
            cost: [
                ability.costs.payGold(4),
                ability.costs.stand(
                    (card) => card.hasTrait('Sand Snake') && card.getType() === 'character'
                )
            ],
            handler: (context) => {
                context.player.putIntoPlay(this);
                this.game.addMessage(
                    '{0} pays 4 gold and stands {1} to put {2} into play',
                    context.player,
                    context.costs.stand,
                    this
                );
            }
        });
    }
}

NymeriasGuard.code = '10009';

export default NymeriasGuard;
