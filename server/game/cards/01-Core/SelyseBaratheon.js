import DrawCard from '../../drawcard.js';

class SelyseBaratheon extends DrawCard {
    // Selyse Baratheon (01049)
    // Challenges Action: Pay 1 gold to choose a [baratheon] character. Until the end of the phase,
    // that character gains an [intrigue] icon.
    setupCardAbilities(ability) {
        this.action({
            title: 'Pay 1 gold to give an intrigue icon to a character',
            cost: ability.costs.payGold(1),
            target: {
                activePromptTitle: 'Select character',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.isFaction('baratheon') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to give {2} an {3} icon',
                    context.player,
                    this,
                    context.target,
                    'intrigue'
                );
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addIcon('intrigue')
                }));
            }
        });
    }
}

SelyseBaratheon.code = '01049';

export default SelyseBaratheon;
