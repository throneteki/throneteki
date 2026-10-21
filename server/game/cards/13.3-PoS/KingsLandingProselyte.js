import DrawCard from '../../drawcard.js';

class KingsLandingProselyte extends DrawCard {
    // King's Landing Proselyte (13051)
    // Shadow (4).
    // Action: Kill a standing [greyjoy] character to put King's Landing Proselyte into play from
    // shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            location: 'shadows',
            cost: ability.costs.kill((card) => !card.kneeled && card.isFaction('greyjoy')),
            condition: (context) => context.player.canPutIntoPlay(this, 'outOfShadows'),
            message: {
                format: '{player} uses {source} and kills {killed} to put {source} into play from shadows',
                args: { killed: (context) => context.costs.kill }
            },
            handler: (context) => {
                context.player.putIntoPlay(this);
            }
        });
    }
}

KingsLandingProselyte.code = '13051';

export default KingsLandingProselyte;
