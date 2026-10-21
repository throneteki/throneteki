import DrawCard from '../../drawcard.js';

class SmallfolkMob extends DrawCard {
    // Smallfolk Mob (13081)
    // Shadow (4).
    // Action: Sacrifice a unique [stark] character to put Smallfolk Mob into play from shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            location: 'shadows',
            condition: (context) => context.player.canPutIntoPlay(this, 'outOfShadows'),
            cost: ability.costs.sacrifice((card) =>
                card.isMatch({ type: 'character', faction: 'stark', unique: true })
            ),
            message: {
                format: '{player} sacrifices {sacrificedCard} to put {source} into play from shadows',
                args: { sacrificedCard: (context) => context.costs.sacrifice }
            },
            handler: (context) => {
                context.player.putIntoPlay(this, 'outOfShadows');
            }
        });
    }
}

SmallfolkMob.code = '13081';

export default SmallfolkMob;
