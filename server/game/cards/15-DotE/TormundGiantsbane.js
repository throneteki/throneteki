import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class TormundGiantsbane extends DrawCard {
    // Tormund Giantsbane (15040)
    // Intimidate.
    // Reaction: After you win a challenge in which Tormund Giantsbane is participating, place a
    // tale token on him.
    // Action: Discard 1 tale token from Tormund Giantsbane to give a Wildling character +2 STR and
    // renown until the end of the phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.isParticipating(context.source)
            },
            message: '{player} places 1 tale token on {source}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.tale
            }))
        });
        this.action({
            title: 'Give Wildling +2 STR',
            cost: ability.costs.discardTokenFromSelf(Tokens.tale, 1),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Wildling') &&
                    card.getType() === 'character'
            },
            message:
                '{player} uses {source} and discards 1 tale token to give {target} +2 STR and renown until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: [ability.effects.modifyStrength(2), ability.effects.addKeyword('Renown')]
            }))
        });
    }
}

TormundGiantsbane.code = '15040';

export default TormundGiantsbane;
