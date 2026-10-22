import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
            condition: (context) => context.source.calculateStrength() >= 1,
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) => card.isAttacking()
            },
            message: {
                format: '{player} kneels {source} to give {target} +{strBoost} STR until the end of the challenge',
                args: { strBoost: (context) => context.source.calculateStrength() }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(context.source.calculateStrength())
            }))
        });
    }

    calculateStrength() {
        if (!this.game.currentChallenge) {
            return 0;
        }

        return this.game.getNumberOfCardsInPlay(
            (card) =>
                card.controller === this.game.currentChallenge.defendingPlayer &&
                card.kneeled &&
                card.getType() === 'character'
        );
    }
}

BlackBetha.code = '07026';

export default BlackBetha;
