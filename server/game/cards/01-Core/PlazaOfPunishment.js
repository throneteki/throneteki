import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class PlazaOfPunishment extends DrawCard {
    // Plaza of Punishment (01173)
    // Reaction: After you win a [power] challenge, kneel Plaza of Punishment to choose a character
    // without attachments. Until the end of the phase, that character gets -2 STR and is killed if
    // its STR is 0.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'power'
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.attachments.length === 0
            },
            message:
                '{player} kneels {source} to give {target} -2 STR until the end of the phase and kill it if its STR is 0',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.killByStrength(-2)
            }))
        });
    }
}

PlazaOfPunishment.code = '01173';

export default PlazaOfPunishment;
