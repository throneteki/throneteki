import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHornOfWinter extends DrawCard {
    // The Horn of Winter (22027)
    // Unique character only.
    // Attached character gains assault.
    // Reaction: After you win a challenge, sacrifice The Horn of Winter to choose a location that
    // was targeted by assault this challenge. Until the end of the round, treat that location as if
    // its printed text box were blank (except for Traits). If it is a Stronghold location or The
    // Wall, you may discard it from play instead.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true });
        this.whileAttached({
            effect: ability.effects.addKeyword('Assault')
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.winner === context.player
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    card.targetedByAssault
            },
            cost: ability.costs.sacrificeSelf(),
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    context.target.hasTrait('Stronghold') || context.target.name === 'The Wall',
                thenAction: GameActions.choose({
                    title: 'Discard from play?',
                    choices: {
                        'Treat as blank': treatAsBlank(ability),
                        'Discard from play': {
                            message: '{player} sacrifices {source} to discard {target} from play',
                            gameAction: GameActions.discardCard((context) => ({
                                card: context.target
                            }))
                        }
                    }
                }),
                elseAction: treatAsBlank(ability)
            })
        });
    }
}

function treatAsBlank(ability) {
    return {
        message:
            '{player} sacrifices {source} to treat the text box of {target} as blank until the end of the round',
        gameAction: GameActions.lastingEffect((context) => ({
            duration: 'untilEndOfRound',
            match: context.target,
            targetController: 'any',
            effect: ability.effects.blankExcludingTraits
        }))
    };
}

TheHornOfWinter.code = '22027';

export default TheHornOfWinter;
