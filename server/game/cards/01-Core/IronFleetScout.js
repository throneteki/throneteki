import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class IronFleetScout extends DrawCard {
    // Iron Fleet Scout (01079)
    // Challenges Action: Kneel Iron Fleet Scout to choose a participating [greyjoy] character.
    // Until the end of the challenge, that character gets +1 STR. (+2 STR instead if you are the
    // first player.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character +STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.isParticipating() &&
                    card.isFaction('greyjoy')
            },
            message: {
                format: '{player} kneels {source} to give {target} +{strBoost} STR until the end of the challenge',
                args: { strBoost: (context) => (context.player.firstPlayer ? 2 : 1) }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(context.player.firstPlayer ? 2 : 1)
            }))
        });
    }
}

IronFleetScout.code = '01079';

export default IronFleetScout;
