import DrawCard from '../../drawcard.js';

class TheRegentsGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            location: 'shadows',
            cost: ability.costs.returnToHand(
                (card) =>
                    card.getType() === 'character' &&
                    card.isFaction('Lannister') &&
                    !card.hasTrait('Ally') &&
                    card.getPrintedCost() >= 4
            ),
            condition: (context) => context.player.canPutIntoPlay(this, 'outOfShadows'),
            message: {
                format: '{player} returns {returnedCard} to hand to put {source} into play from shadows',
                args: { returnedCard: (context) => context.costs.returnToHand }
            },
            handler: (context) => {
                context.player.putIntoPlay(this);
            }
        });
    }
}

TheRegentsGuard.code = '13029';

export default TheRegentsGuard;
