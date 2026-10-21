import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class LastHearth extends DrawCard {
    // Last Hearth (09036)
    // Action: Kneel Last Hearth to give a participating [stark] character +2 STR until the end of
    // the challenge. (+3 STR instead if there are fewer than 3 plot cards in your used pile.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase character STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.isFaction('stark') &&
                    card.isParticipating()
            },
            message: {
                format: '{player} kneels {source} to give {target} +{strengthBonus} STR until the end of the challenge',
                args: {
                    strengthBonus: (context) => (context.player.getNumberOfUsedPlots() < 3 ? 3 : 2)
                }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(
                    context.player.getNumberOfUsedPlots() < 3 ? 3 : 2
                )
            }))
        });
    }
}

LastHearth.code = '09036';

export default LastHearth;
