import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheNightfort extends DrawCard {
    // The Nightfort (00013)
    // Challenges Action: Kneel The Nightfort to choose a defending [thenightswatch] character.
    // Until the end of the challenge, that character gets +1 STR for each attacking character.
    // Draft format only.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character +STR',
            condition: (context) =>
                context.game.isDuringChallenge({
                    match: (challenge) => challenge.attackers.length >= 1
                }),
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isDefending() &&
                    card.isFaction('thenightswatch')
            },
            message: {
                format: '{player} kneels {source} to give {target} +{strBoost} STR until the end of the challenge',
                args: { strBoost: (context) => context.game.currentChallenge.attackers.length }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(
                    context.game.currentChallenge.attackers.length
                )
            }))
        });
    }
}

TheNightfort.code = '00013';

export default TheNightfort;
