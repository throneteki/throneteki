import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function calculateStrength(source) {
    if (!source.game.currentChallenge) {
        return 0;
    }

    return source.game.getNumberOfCardsInPlay(
        (card) =>
            card.controller === source.game.currentChallenge.defendingPlayer &&
            card.kneeled &&
            card.getType() === 'character'
    );
}

class BlackBetha extends DrawCard {
    // Black Betha (07026)
    // While you control Ser Davos Seaworth, he gains renown.
    // Action: Kneel Black Betha to choose an attacking character. Until the end of the challenge,
    // that character gets +X STR. X is the number of kneeling characters the defending player
    // controls.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Ser Davos Seaworth',
            effect: ability.effects.addKeyword('renown')
        });
        this.action({
            title: 'Give attacking character +STR',
            condition: (context) => calculateStrength(context.source) >= 1,
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) => card.isAttacking()
            },
            message: {
                format: '{player} kneels {source} to give {target} +{strBoost} STR until the end of the challenge',
                args: { strBoost: (context) => calculateStrength(context.source) }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(calculateStrength(context.source))
            }))
        });
    }
}

BlackBetha.code = '07026';

export default BlackBetha;
